import './chat.css';
import type { LearningPath, Topic } from '../types/knowledge';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type NodeType = 'topic' | 'path';

export class ChatPanel {
  private container: HTMLElement | null = null;
  private messagesContainer: HTMLElement | null = null;
  private inputElement: HTMLTextAreaElement | null = null;
  private sendButton: HTMLButtonElement | null = null;
  private currentNodeData: Topic | LearningPath | null = null;
  private currentNodeType: NodeType = 'topic';
  private currentNodeId = '';
  private messages: ChatMessage[] = [];
  private isStreaming = false;
  private abortController: AbortController | null = null;

  public open(nodeData: Topic | LearningPath, type: NodeType): void {
    const nodeId = type === 'topic' ? (nodeData as Topic).id : (nodeData as LearningPath).id;

    if (nodeId !== this.currentNodeId) {
      this.messages = [];
      this.currentNodeId = nodeId;
    }

    this.currentNodeData = nodeData;
    this.currentNodeType = type;

    if (this.container) {
      this.container.remove();
    }

    this.container = this.createDOM();
    document.body.appendChild(this.container);
    this.renderMessages();
    this.inputElement?.focus();
  }

  public close(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isStreaming = false;

    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }

  private createDOM(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'chat-panel';

    const nodeName =
      this.currentNodeType === 'topic'
        ? (this.currentNodeData as Topic).displayName
        : (this.currentNodeData as LearningPath).title;

    // Header
    const header = document.createElement('div');
    header.className = 'chat-header';

    const title = document.createElement('span');
    title.className = 'chat-title';
    title.textContent = `AI 助教 — ${nodeName}`;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'chat-close-btn';
    closeBtn.textContent = '\u00d7';
    closeBtn.addEventListener('click', () => this.close());

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Messages
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'chat-messages';
    this.messagesContainer = messagesContainer;

    // Input area
    const inputArea = document.createElement('div');
    inputArea.className = 'chat-input-area';

    const input = document.createElement('textarea');
    input.className = 'chat-input';
    input.placeholder = '输入你的问题...';
    input.rows = 1;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 80) + 'px';
    });
    this.inputElement = input;

    const sendBtn = document.createElement('button');
    sendBtn.className = 'chat-send-btn';
    sendBtn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
    sendBtn.addEventListener('click', () => this.sendMessage());
    this.sendButton = sendBtn;

    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(messagesContainer);
    panel.appendChild(inputArea);

    return panel;
  }

  private renderMessages(): void {
    if (!this.messagesContainer) return;
    this.messagesContainer.innerHTML = '';

    if (this.messages.length === 0) {
      const nodeName =
        this.currentNodeType === 'topic'
          ? (this.currentNodeData as Topic).displayName
          : (this.currentNodeData as LearningPath).title;

      this.appendBubble(
        'assistant',
        `你好！我是你的AI助教，当前主题是「${nodeName}」。有什么问题可以问我！`
      );
    } else {
      for (const msg of this.messages) {
        this.appendBubble(msg.role, msg.content);
      }
    }
  }

  private appendBubble(role: 'user' | 'assistant', content: string): HTMLElement {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    if (role === 'assistant') {
      bubble.innerHTML = this.renderMarkdown(content);
    } else {
      bubble.textContent = content;
    }

    msgDiv.appendChild(bubble);
    this.messagesContainer?.appendChild(msgDiv);
    this.scrollToBottom();
    return bubble;
  }

  private appendLoading(): HTMLElement {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message assistant';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    const loading = document.createElement('div');
    loading.className = 'chat-loading';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'chat-loading-dot';
      loading.appendChild(dot);
    }

    bubble.appendChild(loading);
    msgDiv.appendChild(bubble);
    this.messagesContainer?.appendChild(msgDiv);
    this.scrollToBottom();
    return bubble;
  }

  private async sendMessage(): Promise<void> {
    if (this.isStreaming || !this.inputElement) return;

    const content = this.inputElement.value.trim();
    if (!content) return;

    this.inputElement.value = '';
    this.inputElement.style.height = 'auto';

    this.messages.push({ role: 'user', content });
    this.appendBubble('user', content);

    this.isStreaming = true;
    this.setSendEnabled(false);

    const loadingBubble = this.appendLoading();

    try {
      const topicPayload = this.buildTopicPayload();
      const fullText = await this.streamResponse(topicPayload, loadingBubble);
      this.messages.push({ role: 'assistant', content: fullText });
    } catch (err) {
      const errorMsg = err instanceof Error && err.name === 'AbortError'
        ? '已停止回复'
        : '请求失败，请稍后再试';
      loadingBubble.innerHTML = `<span class="chat-error">${errorMsg}</span>`;
    } finally {
      this.isStreaming = false;
      this.abortController = null;
      this.setSendEnabled(true);
      this.inputElement?.focus();
    }
  }

  private buildTopicPayload(): object {
    if (this.currentNodeType === 'path') {
      const p = this.currentNodeData as LearningPath;
      return {
        topic: {
          title: p.title,
          difficulty: p.difficulty,
          stage: p.stage,
          topics: p.topics,
          description: p.description
        },
        type: 'path',
        messages: this.messages.map((m) => ({ role: m.role, content: m.content }))
      };
    }

    const t = this.currentNodeData as Topic;
    return {
      topic: {
        displayName: t.displayName,
        level: t.level,
        tags: t.tags,
        description: t.description
      },
      type: 'topic',
      messages: this.messages.map((m) => ({ role: m.role, content: m.content }))
    };
  }

  private async streamResponse(body: object, bubble: HTMLElement): Promise<string> {
    this.abortController = new AbortController();

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: this.abortController.signal
    });

    if (!response.ok || !response.body) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          const delta = parsed.choices?.[0]?.delta?.content || '';
          if (delta) {
            fullText += delta;
            bubble.innerHTML = this.renderMarkdown(fullText);
            this.scrollToBottom();
          }
        } catch (e) {
          if (e instanceof Error && e.message && !e.message.includes('JSON')) {
            throw e;
          }
        }
      }
    }

    return fullText;
  }

  private renderMarkdown(text: string): string {
    let html = text
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks: ```lang\n...\n```
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
      return `<pre><code>${code}</code></pre>`;
    });

    // Inline code: `...`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold: **...**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Unordered list items: - ...
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Ordered list items: 1. ...
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Paragraphs: double newline
    html = html.replace(/\n\n/g, '</p><p>');
    html = `<p>${html}</p>`;

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');

    // Single newlines to <br> (but not inside pre)
    html = html.replace(/<\/p><p>/g, '</p>\n<p>');

    return html;
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  private setSendEnabled(enabled: boolean): void {
    if (this.sendButton) {
      this.sendButton.disabled = !enabled;
    }
  }
}
