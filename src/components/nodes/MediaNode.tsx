
import React, { useRef, useState } from 'react';
import { Video, Image as ImageIcon, Layers, Sparkles, Music } from 'lucide-react';
import { NodeContentProps } from '../../types/schema';
import { NodeEmptyState, MenuAction } from './NodeEmptyState';
import { MediaViewerModal } from '../MediaViewerModal';
import '../../styles/canvas.css';

// Image Node
export const ImageNode: React.FC<NodeContentProps> = ({ data, isConnected, onChange }) => {
  
  const imgRef = useRef<HTMLImageElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems: MenuAction[] = [
    { id: 'img-to-img', icon: ImageIcon, label: '图生图' },
    { id: 'img-to-video', icon: ImageIcon, label: '图生视频' },
    { id: 'remove-bg', icon: Layers, label: '图片换背景' },
    { id: 'first-frame-video', icon: Video, label: '首帧图生视频' },
  ];

  const mediaSrc = data.src || data.output;
  // showContent needs to verify that mediaSrc is actually present if it's relying on data
  // isConnected implies there's an upstream connection, but doesn't mean we have data yet.
  // However, if we have mediaSrc, we should definitely show it.
  const showContent = Boolean(mediaSrc || isConnected);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // Report original dimensions to the parent (Demo logic will pick this up)
    if (img.naturalWidth && img.naturalHeight) {
        onChange({ 
            _contentSize: { 
                width: img.naturalWidth, 
                height: img.naturalHeight 
            } 
        });
    }
  };

  if (!showContent) {
    return (
      <NodeEmptyState 
        items={menuItems}
        onAction={(action) => console.log('Image action:', action)} 
      />
    );
  }

  return (
    <>
      <div 
        className="cf-media-node-container" 
        onDoubleClick={() => mediaSrc && setIsModalOpen(true)}
        title="双击查看大图"
      >
        {mediaSrc && (
          <img 
            ref={imgRef}
            src={mediaSrc} 
            alt="generated" 
            className="cf-media-node-content"
            onLoad={handleImageLoad}
            style={{ display: 'block', cursor: 'zoom-in' }} 
          />
        )}
      </div>
      
      <MediaViewerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        src={mediaSrc} 
        type="image" 
      />
    </>
  );
};

// Video Node
export const VideoNode: React.FC<NodeContentProps> = ({ data, isConnected, onChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems: MenuAction[] = [
    { id: 'first-last-frame-to-video', icon: Layers, label: '首尾帧生成视频' },
    { id: 'first-frame-to-video', icon: Sparkles, label: '首帧生成视频' },
  ];

  const showContent = isConnected || data.output || data.src;
  const mediaSrc = data.src || data.output;

  const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.videoWidth && video.videoHeight) {
        onChange({ 
            _contentSize: { 
                width: video.videoWidth, 
                height: video.videoHeight 
            } 
        });
    }
  };

  if (!showContent) {
    return (
      <NodeEmptyState 
        items={menuItems}
        onAction={(action) => console.log('Video action:', action)} 
      />
    );
  }

  return (
    <>
      <div 
        className="cf-media-node-container"
        title="双击全屏预览"
      >
        {mediaSrc && (
          <video 
            ref={videoRef}
            src={mediaSrc} 
            controls
            controlsList="nofullscreen"
            className="cf-media-node-content"
            onLoadedMetadata={handleVideoLoad}
            style={{ display: 'block' }}
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (mediaSrc) setIsModalOpen(true);
            }}
          />
        )}
      </div>

      <MediaViewerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        src={mediaSrc} 
        type="video" 
      />
    </>
  );
};

// Audio Node
export const AudioNode: React.FC<NodeContentProps> = ({ data, isConnected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems: MenuAction[] = [
    { id: 'audio-to-video', icon: Music, label: '音频生视频' },
  ];

  const showContent = isConnected || data.output || data.src;
  const mediaSrc = data.src || data.output;

  if (!showContent) {
    return (
      <NodeEmptyState 
        items={menuItems}
        onAction={(action) => console.log('Audio action:', action)} 
      />
    );
  }

  return (
    <>
      <div 
        className="cf-media-node-container"
        onDoubleClick={() => mediaSrc && setIsModalOpen(true)}
        title="双击打开播放器"
        style={{ cursor: 'pointer' }}
      >
        {mediaSrc && (
          <audio 
            src={mediaSrc} 
            controls
            className="cf-media-node-content"
            style={{ width: '100%', marginTop: 'auto', marginBottom: 'auto' }}
          />
        )}
      </div>

      <MediaViewerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        src={mediaSrc} 
        type="audio" 
      />
    </>
  );
};
