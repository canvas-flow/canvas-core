import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { NodeContentProps } from '../../types/schema';
import '../../styles/canvas.css';

/**
 * 上传节点组件（纯渲染组件）
 * 
 * 职责：
 * 1. 渲染上传 UI（上传按钮、预览、加载状态、错误提示）
 * 2. 触发上传事件（通过 onChange 回调通知 Demo 层）
 * 3. 文件类型前端校验（只允许图片和视频）
 * 
 * 不负责：
 * 1. 实际的文件上传（由 Demo 层的 api.uploadFile 处理）
 * 2. 上传状态管理（由 Demo 层通过 Core API 设置）
 */
export const UploadNode: React.FC<NodeContentProps> = ({ data, onChange }) => {
  const [isHovering, setIsHovering] = useState(false);

  // ✅ 从 data 中获取上传状态（由 Demo 层设置）
  const isUploading = data._uploading || false;
  const uploadError = data._uploadError;

  // ✅ 支持的文件类型：只允许图片和视频
  const acceptTypes = 'image/*,video/*';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ✅ 验证文件类型
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      onChange({ 
        _uploadError: '只支持图片和视频文件' 
      });
      return;
    }

    // ✅ 通知 Demo 层进行上传（通过特殊字段 _uploadRequest）
    onChange({ 
      _uploadRequest: file,
      fileName: file.name,
      fileType: file.type,
      _uploadError: null, // 清除之前的错误
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ 
      src: null, 
      fileName: null, 
      fileType: null,
      output: null,
      _uploadError: null 
    });
  };

  const renderPreview = () => {
    // ✅ 优先使用 src（标准媒体字段）
    const mediaUrl = data.src || data.output;
    if (!mediaUrl) return null;

    const fileType = data.fileType || '';
    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');
    
    if (isImage || !fileType) {
      // 如果没有 fileType，尝试作为图片渲染
      return (
        <img 
          src={mediaUrl} 
          alt="uploaded" 
          className="cf-upload-preview-image"
          onError={(e) => {
            console.error('Image load failed:', mediaUrl);
          }}
        />
      );
    }

    if (isVideo) {
      return (
        <video 
          src={mediaUrl} 
          className="cf-upload-preview-video"
          controls
        />
      );
    }

    return null;
  };

  // ✅ 渲染上传区域
  const hasContent = data.src || data.output;

  return (
    <div 
      className={`cf-upload-container ${hasContent ? 'has-content' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 上传中遮罩 */}
      {isUploading && (
        <div className="cf-upload-loading-overlay">
          <div className="cf-spinner"></div>
          <span>上传中...</span>
        </div>
      )}

      {/* 上传错误提示 */}
      {uploadError && !isUploading && (
        <div className="cf-upload-error-overlay">
          <span>⚠️ {uploadError}</span>
        </div>
      )}

      {hasContent ? (
        <div className="cf-upload-content-wrapper">
          {renderPreview()}
          
          {/* 删除按钮 */}
          {isHovering && !isUploading && (
            <div 
              onClick={handleRemove}
              className="cf-upload-delete-btn"
              title="移除文件"
            >
              <X size={14} />
            </div>
          )}
        </div>
      ) : (
        <label className="cf-upload-placeholder">
          <input 
            type="file" 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
            accept={acceptTypes}
            disabled={isUploading}
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <ImageIcon size={20} strokeWidth={1.5} />
            <VideoIcon size={20} strokeWidth={1.5} />
          </div>
          <Upload size={24} />
          <span className="cf-upload-label-text">点击上传图片或视频</span>
          <span className="cf-upload-subtext" style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
            支持 JPG、PNG、MP4 等格式
          </span>
        </label>
      )}
    </div>
  );
};
