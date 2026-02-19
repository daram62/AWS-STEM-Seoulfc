// API Endpoint - CloudFormation Output에서 가져온 값으로 교체 필요
// 학생들이 S3에 업로드할 때 이 값을 수정해야 합니다
const API_ENDPOINT = 'https://YOUR_API_GATEWAY_ID.execute-api.ap-northeast-2.amazonaws.com/prod';

// DOM Elements
const connectionPanel = document.getElementById('connectionPanel');
const chatContainer = document.getElementById('chatContainer');
const historyPanel = document.getElementById('historyPanel');
const agentIdInput = document.getElementById('agentId');
const agentAliasInput = document.getElementById('agentAlias');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const statusText = document.getElementById('statusText');
const status = document.getElementById('status');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// State
let currentAgentId = null;
let currentAgentAlias = null;
let sessionId = generateSessionId();
let messageHistory = [];
let isLoading = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    loadChatHistory();
    setupEventListeners();
    detectApiEndpoint();
});

// Detect API Endpoint from current domain
function detectApiEndpoint() {
    // CloudFormation이 배포한 후, API Gateway URL을 자동 감지
    // 실제 배포 시에는 CloudFormation Output에서 가져온 값으로 교체
    const savedEndpoint = localStorage.getItem('apiEndpoint');
    if (savedEndpoint) {
        // API_ENDPOINT를 동적으로 설정 가능하도록 수정 필요
        console.log('Using saved API Endpoint:', savedEndpoint);
    }
}

// Event Listeners
function setupEventListeners() {
    connectBtn.addEventListener('click', handleConnect);
    disconnectBtn.addEventListener('click', handleDisconnect);
    sendBtn.addEventListener('click', handleSend);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSend();
        }
    });
    clearHistoryBtn.addEventListener('click', handleClearHistory);
}

// Handle Connect
async function handleConnect() {
    const agentId = agentIdInput.value.trim();
    const agentAlias = agentAliasInput.value.trim() || 'TSTALIASID';

    if (!agentId) {
        showError('Agent ID를 입력해주세요.');
        return;
    }

    // Validate Agent ID format (basic check)
    if (agentId.length < 10) {
        showError('올바른 Agent ID를 입력해주세요.');
        return;
    }

    currentAgentId = agentId;
    currentAgentAlias = agentAlias;
    
    // Save to localStorage
    saveToLocalStorage();

    // Update UI
    connectionPanel.style.display = 'none';
    chatContainer.style.display = 'block';
    historyPanel.style.display = 'block';
    
    updateStatus('connected', '연결됨');
    
    // Clear previous messages except welcome
    clearMessages();
    addBotMessage('안녕하세요! 무엇을 도와드릴까요? 😊');
}

// Handle Disconnect
function handleDisconnect() {
    currentAgentId = null;
    currentAgentAlias = null;
    sessionId = generateSessionId();
    
    connectionPanel.style.display = 'block';
    chatContainer.style.display = 'none';
    historyPanel.style.display = 'none';
    
    updateStatus('disconnected', '연결 대기중');
}

// Handle Send Message
async function handleSend() {
    const message = messageInput.value.trim();
    
    if (!message || isLoading) return;
    
    // Add user message to chat
    addUserMessage(message);
    messageInput.value = '';
    
    // Show loading
    isLoading = true;
    const loadingId = addLoadingMessage();
    
    try {
        // Call API
        const response = await invokeAgent(currentAgentId, currentAgentAlias, message);
        
        // Remove loading
        removeMessage(loadingId);
        
        // Add bot response
        addBotMessage(response);
        
        // Save to history
        saveToHistory(message, response);
        
    } catch (error) {
        // Remove loading
        removeMessage(loadingId);
        
        // Show error
        addBotMessage(`오류가 발생했습니다: ${error.message}`);
        console.error('Error:', error);
    } finally {
        isLoading = false;
    }
}

// Invoke Agent API
async function invokeAgent(agentId, agentAlias, input) {
    const response = await fetch(`${API_ENDPOINT}/invoke`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            agentId: agentId,
            agentAliasId: agentAlias,
            sessionId: sessionId,
            input: input
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Agent 호출에 실패했습니다.');
    }

    const data = await response.json();
    return data.response;
}

// UI Helper Functions
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-bubble">${escapeHtml(text)}</div>
            <div class="message-time">${getTimeString()}</div>
        </div>
        <div class="message-avatar">👤</div>
    `;
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-bubble">${escapeHtml(text)}</div>
            <div class="message-time">${getTimeString()}</div>
        </div>
    `;
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

function addLoadingMessage() {
    const id = `loading-${Date.now()}`;
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.id = id;
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-bubble loading">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
    return id;
}

function removeMessage(id) {
    const messageDiv = document.getElementById(id);
    if (messageDiv) {
        messageDiv.remove();
    }
}

function clearMessages() {
    messagesDiv.innerHTML = '';
}

function updateStatus(type, text) {
    statusText.textContent = text;
    status.className = `status ${type}`;
}

function showError(message) {
    // Simple alert for now
    alert(message);
}

function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Chat History Functions
function saveToHistory(userMessage, botResponse) {
    const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        userMessage: userMessage,
        botResponse: botResponse
    };
    
    messageHistory.unshift(historyItem);
    
    // Limit history to 50 items
    if (messageHistory.length > 50) {
        messageHistory = messageHistory.slice(0, 50);
    }
    
    localStorage.setItem('chatHistory', JSON.stringify(messageHistory));
    renderHistory();
}

function loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        try {
            messageHistory = JSON.parse(saved);
            renderHistory();
        } catch (e) {
            console.error('Failed to load chat history:', e);
            messageHistory = [];
        }
    }
}

function renderHistory() {
    historyList.innerHTML = '';
    
    if (messageHistory.length === 0) {
        historyList.innerHTML = '<div class="history-empty">대화 기록이 없습니다</div>';
        return;
    }
    
    messageHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-question">
                <strong>Q:</strong> ${escapeHtml(item.userMessage)}
            </div>
            <div class="history-answer">
                <strong>A:</strong> ${escapeHtml(item.botResponse.substring(0, 100))}${item.botResponse.length > 100 ? '...' : ''}
            </div>
            <div class="history-time">${formatDate(item.timestamp)}</div>
        `;
        historyList.appendChild(historyItem);
    });
}

function handleClearHistory() {
    if (confirm('모든 대화 기록을 삭제하시겠습니까?')) {
        messageHistory = [];
        localStorage.removeItem('chatHistory');
        renderHistory();
    }
}

// LocalStorage Functions
function saveToLocalStorage() {
    localStorage.setItem('agentId', currentAgentId);
    localStorage.setItem('agentAlias', currentAgentAlias);
}

function loadFromLocalStorage() {
    const savedAgentId = localStorage.getItem('agentId');
    const savedAgentAlias = localStorage.getItem('agentAlias');
    
    if (savedAgentId) {
        agentIdInput.value = savedAgentId;
    }
    if (savedAgentAlias) {
        agentAliasInput.value = savedAgentAlias;
    }
}

// Utility Functions
function generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getTimeString() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}시간 전`;
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${month}/${day} ${hours}:${minutes}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-detect API Endpoint on page load
(function() {
    // CloudFormation 배포 후 이 부분을 수정하거나
    // index.html에 script로 주입하는 방식도 가능
    console.log('Current API Endpoint:', API_ENDPOINT);
    console.log('Agent ID from localStorage:', localStorage.getItem('agentId'));
})();
