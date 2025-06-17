import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, Smile, Search, MoreHorizontal } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: number;
  sender: string;
  avatar: string;
  role: 'interviewer' | 'candidate';
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  reactions?: string[];
  type: 'text' | 'file' | 'code';
  fileName?: string;
}

interface ChatTabProps {
  onUnreadChange: (count: number) => void;
}

function useChatMessages(roomId: string) {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!roomId) return;
    let subscription: any;
    setLoading(true);
    // Fetch initial messages
    supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('timestamp', { ascending: true })
      .then(({ data }) => {
        setMessages(data || []);
        setLoading(false);
      });
    // Subscribe to new messages
    subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages((msgs) => [...msgs, payload.new]);
        }
      )
      .subscribe();
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [roomId]);

  const sendMessage = async (msg: { sender: string; role: string; content: string; avatar?: string; type?: string; fileName?: string; }) => {
    await supabase.from('messages').insert({
      room_id: roomId,
      sender: msg.sender,
      role: msg.role,
      content: msg.content,
      avatar: msg.avatar || '/placeholder.svg',
      type: msg.type || 'text',
      file_name: msg.fileName || null,
      timestamp: new Date().toISOString(),
      status: 'sent',
    });
  };

  return { messages, loading, sendMessage };
}

export const ChatTab: React.FC<ChatTabProps> = ({ onUnreadChange }) => {
  const [message, setMessage] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const interviewId = searchParams.get('id');
  const chatRoomId = roomId || (interviewId ? `interview-chat-${interviewId}` : 'shared-interview-chat-fixed');
  const { messages, loading, sendMessage } = useChatMessages(chatRoomId);

  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage({
        sender: 'John Doe', // TODO: Replace with actual user
        role: 'interviewer', // TODO: Replace with actual role
        content: message.trim(),
      });
      setMessage('');
      onUnreadChange(0);
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓';
      default: return '';
    }
  };

  const filteredMessages = messages.filter(msg =>
    (msg.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (msg.sender || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header with Search */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-primary border border-border-dark rounded pl-10 pr-3 py-2 text-white text-sm focus:outline-none focus:border-tech-green"
          />
        </div>
        <Button variant="ghost" size="icon" className="text-text-secondary hover:text-white h-9 w-9">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 bg-dark-primary rounded border border-border-dark p-4 mb-4">
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              <div className={`flex ${msg.role === 'interviewer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'interviewer' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={msg.avatar} />
                    <AvatarFallback className="bg-tech-green text-dark-primary text-xs">
                      {msg.sender?.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-tech-green font-medium text-sm">{msg.sender}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${msg.role === 'interviewer' ? 'border-blue-500 text-blue-400' : 'border-purple-500 text-purple-400'}`}
                      >
                        {msg.role === 'interviewer' ? 'Interviewer' : 'Candidate'}
                      </Badge>
                      <span className="text-text-secondary text-xs">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      msg.role === 'interviewer' 
                        ? 'bg-tech-green/20 text-white' 
                        : 'bg-dark-secondary text-white'
                    }`}>
                      {msg.type === 'file' ? (
                        <div className="flex items-center space-x-2">
                          <Paperclip className="w-4 h-4" />
                          <span className="text-tech-green font-medium">{msg.file_name}</span>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${
                          msg.status === 'read' ? 'text-tech-green' : 'text-text-secondary'
                        }`}>
                          {getStatusIcon(msg.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-purple-500 text-white text-xs">SC</AvatarFallback>
              </Avatar>
              <div className="bg-dark-secondary p-3 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message... (Use @ to mention)"
              className="w-full bg-dark-primary border border-border-dark rounded px-3 py-2 pr-20 text-white text-sm focus:outline-none focus:border-tech-green"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-text-secondary hover:text-white">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-text-secondary hover:text-white">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={handleSend} 
            className="bg-tech-green hover:bg-tech-green/80 text-dark-primary px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-xs text-text-secondary">
          <span className="font-medium">Shortcuts:</span> Ctrl+Enter to send, @ to mention, /code for code block
        </div>
      </div>
    </div>
  );
};
