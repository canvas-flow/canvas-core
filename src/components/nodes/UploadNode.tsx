
import React, { useState } from 'react';
import { Upload, FileText, X, Music, Video } from 'lucide-react';
import { NodeContentProps } from '../../types/schema';
import '../../styles/canvas.css';

export const UploadNode: React.FC<NodeContentProps> = ({ data, onChange }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 获取配置
  const uploadAction = data.params?.action; // 上传接口地址
  const acceptTypes = data.params?.accept || '*'; // 接受的文件类型

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 如果配置了 uploadAction，则执行真实上传
    if (uploadAction) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(uploadAction, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Upload failed: ${res.statusText}`);
        }

        const json = await res.json();
        // 尝试解析返回的 URL，兼容常见的 { url: ... } 或 { data: { url: ... } } 格式，以及自定义的 file_url
        const uploadedUrl = json.url || json.data?.url || json.fileUrl || json.data?.file_url;

        if (!uploadedUrl) {
            console.warn('Upload successful but could not find URL in response:', json);
            alert('Upload successful but URL not found in response. See console.');
            return;
        }

        onChange({
          output: uploadedUrl,
          src: uploadedUrl, // 增加 src 字段以便兼容性回显
          fileName: file.name,
          fileType: file.type,
          _uploadResult: json.data // 保留原始上传结果数据
        });

      } catch (error: any) {
        console.error('Upload error:', error);
        alert(`上传失败: ${error.message}`);
      } finally {
        setUploading(false);
      }
    } else {
      // 降级逻辑：使用本地 Blob URL (仅用于演示或无后端情况)
      const url = URL.createObjectURL(file);
      onChange({ 
        output: url, 
        fileName: file.name,
        fileType: file.type
      });
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent node selection
    // 如果是 Blob URL，释放内存
    if (data.output && data.output.startsWith('blob:')) {
      URL.revokeObjectURL(data.output); 
    }
    onChange({ output: null, fileName: null, fileType: null });
  };

  const renderContent = () => {
    if (!data.output) return null;

    const fileType = data.fileType || '';
    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');
    const isAudio = fileType.startsWith('audio/');
    
    if (isImage) {
      return (
        <img 
          src={data.output} 
          alt="uploaded" 
          className="cf-upload-preview-image"
        />
      );
    }

    if (isVideo) {
        return (
            <video 
                src={data.output} 
                className="cf-upload-preview-video"
                controls
            />
        );
    }

    if (isAudio) {
        return (
             <div className="cf-upload-preview-audio">
                <Music size={48} strokeWidth={1.5} />
                <audio src={data.output} controls style={{ maxWidth: '90%' }} />
            </div>
        )
    }

    // Generic file
    return (
      <div className="cf-upload-preview-file">
        <FileText size={48} strokeWidth={1.5} />
      </div>
    );
  };

  return (
    <div 
      className={`cf-upload-container ${data.output ? 'has-content' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {uploading && (
          <div className="cf-upload-loading-overlay">
              <div className="cf-spinner"></div>
              <span>Uploading...</span>
          </div>
      )}

      {data.output ? (
        <div className="cf-upload-content-wrapper">
          {renderContent()}
          
          {/* Delete Button */}
          {isHovering && (
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
          />
          <Upload size={24} />
          <span className="cf-upload-label-text">点击上传文件</span>
          {acceptTypes !== '*' && (
             <span className="cf-upload-subtext" style={{ fontSize: 10, color: '#444', marginTop: 4 }}>
                 {acceptTypes}
             </span>
          )}
        </label>
      )}
    </div>
  );
};
