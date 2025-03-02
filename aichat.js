class AIChatExtension {
  constructor () {
    this.apiUrl = '';
    this.apiKey = '';
    this.apiModel = ''; // 新增：允许用户自定义 AI 模型
    this.aiReply = '';
  }

  getInfo () {
    return {
      id: 'aichat',
      name: 'AI Chat',
      color1: '#4C97FF',
      color2: '#3373CC',
      blocks: [
        {
          opcode: 'set_api_config',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置 OpenRouter API URL [URL], API Key [API_KEY], AI 模型 [MODEL]',
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://openrouter.ai/api/v1'
            },
            API_KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: ''
            },
            MODEL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'deepseek/deepseek-r1:free'
            }
          }
        },
        {
          opcode: 'send_message',
          blockType: Scratch.BlockType.COMMAND,
          text: '发送消息 [MESSAGE]',
          arguments: {
            MESSAGE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '你好，AI！'
            }
          }
        },
        {
          opcode: 'get_ai_reply',
          blockType: Scratch.BlockType.REPORTER,
          text: '获取 AI 回复'
        }
      ]
    };
  }

  set_api_config (args) {
    this.apiUrl = args.URL;
    this.apiKey = args.API_KEY;
    this.apiModel = args.MODEL; // 存储自定义 AI 模型
  }

  send_message (args) {
    const message = args.MESSAGE;
    this.fetchAIReply(message);
  }

  get_ai_reply () {
    return this.aiReply;
  }

  async fetchAIReply (message) {
    if (!this.apiUrl || !this.apiKey || !this.apiModel) {
      this.aiReply = '请先设置完整的 OpenRouter API 配置！';
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'Your Site URL', // 替换为您的网站 URL
        'X-Title': 'Your Site Name' // 替换为您的网站名称
      },
      body: JSON.stringify({
        model: this.apiModel, // 使用自定义模型
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    };

    try {
      const response = await fetch(`${this.apiUrl}/chat/completions`, requestOptions);
      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        this.aiReply = data.choices[0].message.content || 'AI 暂无回复';
      } else {
        this.aiReply = 'AI 无有效回复';
      }
    } catch (error) {
      console.error('Error:', error);
      this.aiReply = '请求失败，请检查 API 配置！';
    }
  }
}

Scratch.extensions.register(new AIChatExtension());