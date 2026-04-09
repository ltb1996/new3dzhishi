import './styles.css';
import { fetchGraphData } from './api/graphApi';
import type { LearningPath, Topic } from './types/knowledge';
import { GraphEngine } from './visualization/GraphEngine';
import { ChatPanel } from './chat/ChatPanel';

document.addEventListener('DOMContentLoaded', () => {
  const app = new KnowledgeGraphApp();
  void app.init();
});

class KnowledgeGraphApp {
  private graphEngine: GraphEngine | null = null;
  private currentViewType: 'topics' | 'paths' = 'topics';
  private currentFilter = '全部主题';
  private audioEnabled = false;
  private audio: HTMLAudioElement | null = null;
  private graphContainer: HTMLElement | null = null;
  private filterContainer: HTMLElement | null = null;
  private topics: Topic[] = [];
  private learningPaths: LearningPath[] = [];
  private topicTags: string[] = ['全部主题'];
  private learningStages: string[] = ['全部路线'];
  private chatPanel = new ChatPanel();

  public async init(): Promise<void> {
    this.graphContainer = document.querySelector('.graph-content') as HTMLElement | null;
    this.filterContainer = document.querySelector('.filter-option-content .character') as HTMLElement | null;

    if (!this.graphContainer) {
      console.error('Graph container not found.');
      return;
    }

    this.graphEngine = new GraphEngine(this.graphContainer);
    this.graphEngine.setNodeClickCallback(this.handleNodeClick.bind(this));

    this.initEventListeners();
    this.initAudio();
    this.setOverlayVisible(true, '正在加载知识图谱数据...');

    try {
      const graphData = await fetchGraphData();
      this.topics = graphData.topics;
      this.learningPaths = graphData.learningPaths;
      this.topicTags = graphData.topicTags;
      this.learningStages = graphData.learningStages;

      this.renderFilterOptions();
      this.visualizeTopics();
    } catch (error) {
      console.error(error);
      this.showLoadError('知识图谱数据加载失败，请先启动后端服务。');
    } finally {
      this.setOverlayVisible(false);
    }
  }

  private initAudio(): void {
    this.audio = new Audio('/assets/audio/background.mp3');
    this.audio.loop = true;
    this.audio.volume = 0.3;
  }

  private initEventListeners(): void {
    const startButton = document.getElementById('start-button');
    startButton?.addEventListener('click', this.handleStartButtonClick.bind(this));

    const instructionOkButton = document.getElementById('instruction-ok');
    instructionOkButton?.addEventListener('click', this.handleInstructionOkClick.bind(this));

    const soundButton = document.querySelector('.sound-button');
    soundButton?.addEventListener('click', this.toggleSound.bind(this));

    const topicOption = document.querySelector('.option.character');
    topicOption?.addEventListener('click', () => this.changeViewType('topics'));

    const pathOption = document.querySelector('.option.movie');
    pathOption?.addEventListener('click', () => this.changeViewType('paths'));

    this.filterContainer?.addEventListener('click', event => {
      const option = (event.target as HTMLElement).closest('.option');
      const label = option?.querySelector('span')?.textContent?.trim();

      if (label) {
        this.applyFilter(label);
      }
    });
  }

  private handleStartButtonClick(): void {
    const introContainer = document.querySelector('.marvel-intro-container');
    const instructionOverlay = document.querySelector('.instruction-overlay');

    if (!introContainer) {
      return;
    }

    introContainer.classList.add('fade-out');
    setTimeout(() => {
      (introContainer as HTMLElement).style.display = 'none';

      if (instructionOverlay) {
        (instructionOverlay as HTMLElement).style.display = 'flex';
      }
    }, 500);
  }

  private handleInstructionOkClick(): void {
    const instructionOverlay = document.querySelector('.instruction-overlay');
    const introContainer = document.querySelector('.marvel-intro-container');

    if (!instructionOverlay) {
      return;
    }

    instructionOverlay.classList.add('fade-out');
    setTimeout(() => {
      (instructionOverlay as HTMLElement).style.display = 'none';

      if (introContainer) {
        (introContainer as HTMLElement).style.display = 'none';
      }
    }, 500);
  }

  private toggleSound(): void {
    this.audioEnabled = !this.audioEnabled;

    const soundOnWrap = document.querySelector('.sound-button .wrap:first-child');
    const soundOffWrap = document.querySelector('.sound-button .wrap:last-child');

    if (this.audioEnabled) {
      if (soundOnWrap) {
        (soundOnWrap as HTMLElement).style.display = 'block';
      }
      if (soundOffWrap) {
        (soundOffWrap as HTMLElement).style.display = 'none';
      }
      this.audio?.play();
      return;
    }

    if (soundOnWrap) {
      (soundOnWrap as HTMLElement).style.display = 'none';
    }
    if (soundOffWrap) {
      (soundOffWrap as HTMLElement).style.display = 'block';
    }
    this.audio?.pause();
  }

  private changeViewType(viewType: 'topics' | 'paths'): void {
    if (this.currentViewType === viewType) {
      return;
    }

    this.currentViewType = viewType;
    this.currentFilter = viewType === 'topics' ? '全部主题' : '全部路线';

    const topicOption = document.querySelector('.option.character');
    const pathOption = document.querySelector('.option.movie');

    topicOption?.classList.toggle('selected', viewType === 'topics');
    pathOption?.classList.toggle('selected', viewType === 'paths');

    this.renderFilterOptions();

    if (viewType === 'topics') {
      this.visualizeTopics();
      return;
    }

    this.visualizeLearningPaths();
  }

  private applyFilter(filter: string): void {
    this.currentFilter = filter;
    this.syncSelectedFilter();

    if (this.currentViewType === 'topics') {
      this.visualizeTopics();
      return;
    }

    this.visualizeLearningPaths();
  }

  private renderFilterOptions(): void {
    if (!this.filterContainer) {
      return;
    }

    const options = this.currentViewType === 'topics' ? this.topicTags : this.learningStages;
    this.filterContainer.innerHTML = '';

    options.forEach(optionLabel => {
      const option = document.createElement('div');
      option.className = 'option';
      option.classList.toggle('selected', optionLabel === this.currentFilter);

      const label = document.createElement('span');
      label.textContent = optionLabel;

      option.appendChild(label);
      this.filterContainer?.appendChild(option);
    });
  }

  private syncSelectedFilter(): void {
    if (!this.filterContainer) {
      return;
    }

    const options = this.filterContainer.querySelectorAll('.option');
    options.forEach(option => {
      const label = option.querySelector('span')?.textContent?.trim();
      option.classList.toggle('selected', label === this.currentFilter);
    });
  }

  private getFilteredTopics(): Topic[] {
    if (this.currentFilter === '全部主题') {
      return this.topics;
    }

    return this.topics.filter(topic => topic.tags.includes(this.currentFilter));
  }

  private getFilteredLearningPaths(): LearningPath[] {
    if (this.currentFilter === '全部路线') {
      return this.learningPaths;
    }

    const stage = Number(this.currentFilter.replace('阶段 ', ''));
    return this.learningPaths.filter(path => path.stage === stage);
  }

  private visualizeTopics(): void {
    this.graphEngine?.visualizeTopics(this.getFilteredTopics());
  }

  private visualizeLearningPaths(): void {
    this.graphEngine?.visualizeLearningPaths(this.getFilteredLearningPaths());
  }

  private handleNodeClick(node: { id: string; type: string; data: Topic | LearningPath }): void {
    this.displayNodeInfo(node);
  }

  private displayNodeInfo(node: { id: string; type: string; data: Topic | LearningPath }): void {
    const infoPanel = document.querySelector('.marvel-info-panel') as HTMLElement | null;

    if (!infoPanel) {
      return;
    }

    infoPanel.innerHTML = '';

    if (node.type === 'topic') {
      this.createTopicInfoPanel(node.data as Topic, infoPanel);
    } else {
      this.createLearningPathInfoPanel(node.data as LearningPath, infoPanel);
    }

    infoPanel.style.width = '300px';
  }

  private createTopicInfoPanel(topic: Topic, container: HTMLElement): void {
    const header = document.createElement('div');
    header.className = 'info-header';

    const closeButton = document.createElement('div');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '<img src="/assets/images/close.svg" alt="Close">';
    closeButton.addEventListener('click', () => {
      container.style.width = '0px';
    });

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'character-image';
    imageWrapper.innerHTML = `<img src="${topic.image}" alt="${topic.name}">`;

    const name = document.createElement('h2');
    name.className = 'character-name';
    name.textContent = topic.displayName;

    const description = document.createElement('p');
    description.className = 'character-description';
    description.textContent = topic.description;

    const details = document.createElement('div');
    details.className = 'character-details';

    const type = document.createElement('div');
    type.className = 'character-type';
    type.innerHTML = `<strong>主题定位:</strong> ${topic.level}`;

    const groups = document.createElement('div');
    groups.className = 'character-groups';
    groups.innerHTML = `<strong>知识标签:</strong> ${topic.tags.join(' / ')}`;

    const relatedPaths = document.createElement('div');
    relatedPaths.className = 'character-movies';
    relatedPaths.innerHTML = `<strong>关联路线:</strong> ${topic.learningPaths.join('、')}`;

    details.appendChild(type);
    details.appendChild(groups);
    details.appendChild(relatedPaths);

    header.appendChild(closeButton);
    header.appendChild(imageWrapper);
    header.appendChild(name);

    const aiButton = document.createElement('button');
    aiButton.className = 'ai-tutor-button';
    aiButton.textContent = 'AI 助教';
    aiButton.addEventListener('click', () => {
      this.chatPanel.open(topic, 'topic');
    });

    container.appendChild(header);
    container.appendChild(description);
    container.appendChild(details);
    container.appendChild(aiButton);
  }

  private createLearningPathInfoPanel(path: LearningPath, container: HTMLElement): void {
    const header = document.createElement('div');
    header.className = 'info-header';

    const closeButton = document.createElement('div');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '<img src="/assets/images/close.svg" alt="Close">';
    closeButton.addEventListener('click', () => {
      container.style.width = '0px';
    });

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'movie-image';
    imageWrapper.innerHTML = `<img src="${path.image}" alt="${path.title}">`;

    const title = document.createElement('h2');
    title.className = 'movie-title';
    title.textContent = path.title;

    const description = document.createElement('p');
    description.className = 'movie-description';
    description.textContent = path.description;

    const details = document.createElement('div');
    details.className = 'movie-details';

    const difficulty = document.createElement('div');
    difficulty.className = 'movie-release-date';
    difficulty.innerHTML = `<strong>适合人群:</strong> ${path.difficulty}`;

    const stage = document.createElement('div');
    stage.className = 'movie-phase';
    stage.innerHTML = `<strong>学习阶段:</strong> 阶段 ${path.stage}`;

    details.appendChild(difficulty);
    details.appendChild(stage);

    const aiButton = document.createElement('button');
    aiButton.className = 'ai-tutor-button';
    aiButton.textContent = 'AI 助教';
    aiButton.addEventListener('click', () => {
      this.chatPanel.open(path, 'path');
    });

    header.appendChild(closeButton);
    header.appendChild(imageWrapper);
    header.appendChild(title);

    container.appendChild(header);
    container.appendChild(description);
    container.appendChild(details);
    container.appendChild(aiButton);
  }

  private setOverlayVisible(visible: boolean, message = 'Loading . . .'): void {
    const overlay = document.querySelector('.overlay') as HTMLElement | null;
    const loadingText = overlay?.querySelector('.loading-icon p');

    if (!overlay) {
      return;
    }

    overlay.style.display = visible ? 'flex' : 'none';

    if (loadingText) {
      loadingText.textContent = message;
    }
  }

  private showLoadError(message: string): void {
    const infoPanel = document.querySelector('.marvel-info-panel') as HTMLElement | null;

    if (!infoPanel) {
      return;
    }

    infoPanel.innerHTML = `<div class="movie-description" style="margin-top: 40px;">${message}</div>`;
    infoPanel.style.width = '300px';
  }
}
