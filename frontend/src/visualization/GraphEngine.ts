import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { LearningPath, Topic } from '../types/knowledge';

interface Node {
  id: string;
  position: THREE.Vector3;
  mesh: THREE.Object3D;
  type: 'topic' | 'path';
  data: Topic | LearningPath;
  pulseOffset: number;
}

interface Link {
  source: Node;
  target: Node;
  line: THREE.Line;
}

export class GraphEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private nodes: Node[] = [];
  private links: Link[] = [];
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private selectedNode: Node | null = null;
  private nodeClickCallback: ((node: Node) => void) | null = null;
  private clock: THREE.Clock;
  private glowTexture: THREE.CanvasTexture;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('graph-canvas') as HTMLCanvasElement,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.glowTexture = this.createGlowTexture();

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this), false);
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);

    this.createSkybox();
    this.addLights();
    this.animate();
  }

  private createSkybox(): void {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      '/assets/skybox/right.png',
      '/assets/skybox/left.png',
      '/assets/skybox/top.png',
      '/assets/skybox/bottom.png',
      '/assets/skybox/front.png',
      '/assets/skybox/back.png'
    ]);

    this.scene.background = texture;
  }

  private addLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-1, 0.5, -1).normalize();
    this.scene.add(backLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.3);
    topLight.position.set(0, 1, 0).normalize();
    this.scene.add(topLight);
  }

  private onWindowResize(): void {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  private onMouseClick(event: MouseEvent): void {
    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.nodes.map(node => node.mesh), true);

    if (intersects.length === 0) {
      return;
    }

    const clickedNode = this.findNodeByObject(intersects[0].object);

    if (clickedNode && this.nodeClickCallback) {
      this.selectedNode = clickedNode;
      this.nodeClickCallback(clickedNode);
    }
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.nodes.map(node => node.mesh), true);

    this.nodes.forEach(node => {
      if (node.mesh.scale.x > 1) {
        node.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    });

    if (intersects.length > 0) {
      const hoveredNode = this.findNodeByObject(intersects[0].object);

      if (hoveredNode) {
        hoveredNode.mesh.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
        document.body.style.cursor = 'pointer';
      }
    } else {
      document.body.style.cursor = 'default';
    }
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    const elapsed = this.clock.getElapsedTime();
    this.controls.update();

    this.nodes.forEach(node => {
      node.mesh.position.y = node.position.y + Math.sin(elapsed * 0.9 + node.pulseOffset) * 0.45;
    });

    this.renderer.render(this.scene, this.camera);
  }

  private normalizeImagePath(imagePath: string): string {
    if (imagePath.startsWith('data:')) {
      return imagePath;
    }

    if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
      return `/${imagePath}`;
    }

    return imagePath;
  }

  private createGlowTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Unable to create glow texture.');
    }

    const gradient = context.createRadialGradient(128, 128, 20, 128, 128, 110);
    gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.35)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
  }

  private findNodeByObject(object: THREE.Object3D): Node | undefined {
    let current: THREE.Object3D | null = object;

    while (current) {
      const matchedNode = this.nodes.find(node => node.mesh === current);
      if (matchedNode) {
        return matchedNode;
      }
      current = current.parent;
    }

    return undefined;
  }

  private createSpriteGroup(
    imagePath: string,
    accentColor: string,
    position: THREE.Vector3,
    size: { width: number; height: number }
  ): THREE.Group {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(this.normalizeImagePath(imagePath));
    texture.colorSpace = THREE.SRGBColorSpace;

    const group = new THREE.Group();
    group.position.copy(position);

    const glowMaterial = new THREE.SpriteMaterial({
      map: this.glowTexture,
      color: new THREE.Color(accentColor),
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });

    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(size.width * 1.35, size.height * 1.35, 1);
    group.add(glow);

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(size.width, size.height, 1);
    group.add(sprite);

    this.scene.add(group);
    return group;
  }

  private createNodePosition(index: number, total: number): THREE.Vector3 {
    const safeTotal = Math.max(total, 1);
    const phi = Math.acos(-1 + (2 * index) / safeTotal);
    const theta = Math.sqrt(safeTotal * Math.PI) * phi;
    const radius = 30;

    return new THREE.Vector3(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    );
  }

  public setNodeClickCallback(callback: (node: Node) => void): void {
    this.nodeClickCallback = callback;
  }

  public visualizeTopics(topics: Topic[]): void {
    this.clearGraph();

    topics.forEach((topic, index) => {
      const position = this.createNodePosition(index, topics.length);
      const mesh = this.createSpriteGroup(topic.image, topic.accentColor, position, {
        width: 7.2,
        height: 7.2
      });

      this.nodes.push({
        id: topic.id,
        position,
        mesh,
        type: 'topic',
        data: topic,
        pulseOffset: index * 0.65
      });
    });

    this.createTopicLinks();
  }

  public visualizeLearningPaths(paths: LearningPath[]): void {
    this.clearGraph();

    paths.forEach((path, index) => {
      const position = this.createNodePosition(index, paths.length);
      const mesh = this.createSpriteGroup(path.image, path.accentColor, position, {
        width: 8.4,
        height: 5.2
      });

      this.nodes.push({
        id: path.id,
        position,
        mesh,
        type: 'path',
        data: path,
        pulseOffset: index * 0.65
      });
    });

    this.createLearningPathLinks();
  }

  private createTopicLinks(): void {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.3
    });

    this.nodes.forEach(sourceNode => {
      if (sourceNode.type !== 'topic') {
        return;
      }

      const topic = sourceNode.data as Topic;
      topic.connections.forEach(targetId => {
        const targetNode = this.nodes.find(node => node.id === targetId);

        if (!targetNode) {
          return;
        }

        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          sourceNode.position,
          targetNode.position
        ]);

        const line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(line);

        this.links.push({
          source: sourceNode,
          target: targetNode,
          line
        });
      });
    });
  }

  private createLearningPathLinks(): void {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.3
    });

    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const pathA = this.nodes[i].data as LearningPath;
        const pathB = this.nodes[j].data as LearningPath;
        const sharedTopics = pathA.topics.filter(topicId => pathB.topics.includes(topicId));

        if (sharedTopics.length === 0) {
          continue;
        }

        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          this.nodes[i].position,
          this.nodes[j].position
        ]);

        const line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(line);

        this.links.push({
          source: this.nodes[i],
          target: this.nodes[j],
          line
        });
      }
    }
  }

  private clearGraph(): void {
    this.nodes.forEach(node => {
      this.scene.remove(node.mesh);
    });

    this.links.forEach(link => {
      this.scene.remove(link.line);
    });

    this.nodes = [];
    this.links = [];
  }

  public highlightNode(nodeId: string): void {
    const node = this.nodes.find(candidate => candidate.id === nodeId);

    if (!node) {
      return;
    }

    this.nodes.forEach(candidate => {
      candidate.mesh.scale.set(1, 1, 1);
    });

    node.mesh.scale.set(1.5, 1.5, 1.5);
    this.selectedNode = node;
    this.focusCamera(node.position);
  }

  private focusCamera(position: THREE.Vector3): void {
    const offset = new THREE.Vector3(0, 0, 20);
    const target = position.clone();

    this.controls.target.copy(target);
    this.camera.position.copy(target.clone().add(offset));
    this.controls.update();
  }

  public resetCamera(): void {
    this.camera.position.set(0, 0, 50);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  public getSelectedNode(): Node | null {
    return this.selectedNode;
  }
}
