import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, FileImage, FolderOpen, Trash2, Upload } from 'lucide-react';

const ATTACHMENT_FOLDERS = ['个人身份证明', '车辆证明', '发票', '损失证明', '其他', '委托证明', '事故证明'] as const;

type AttachmentFolder = (typeof ATTACHMENT_FOLDERS)[number];

type AttachmentItem = {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  uploadedAt: string;
};

type AttachmentStore = Partial<Record<AttachmentFolder, AttachmentItem[]>>;

const buildStorageKey = (assistNo: string) => `claim_attachments_${assistNo}`;

export default function AttachmentManager({
  assistNo,
  onClose,
  initialFolder,
}: {
  assistNo: string;
  onClose: () => void;
  initialFolder?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeFolder, setActiveFolder] = useState<AttachmentFolder>('个人身份证明');
  const [store, setStore] = useState<AttachmentStore>({});
  const [selectedFileId, setSelectedFileId] = useState<string>('');

  useEffect(() => {
    if (!assistNo) return;

    const raw = localStorage.getItem(buildStorageKey(assistNo));
    
    if (initialFolder && ATTACHMENT_FOLDERS.includes(initialFolder as AttachmentFolder)) {
      setActiveFolder(initialFolder as AttachmentFolder);
    }
    
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as AttachmentStore;
      setStore(parsed);

      if (initialFolder && ATTACHMENT_FOLDERS.includes(initialFolder as AttachmentFolder)) {
        const firstFile = parsed[initialFolder as AttachmentFolder]?.[0];
        if (firstFile) {
          setSelectedFileId(firstFile.id);
        }
      } else {
        for (const folder of ATTACHMENT_FOLDERS) {
          const firstFile = parsed[folder]?.[0];
          if (firstFile) {
            setActiveFolder(folder);
            setSelectedFileId(firstFile.id);
            break;
          }
        }
      }
    } catch {
      setStore({});
    }
  }, [assistNo, initialFolder]);

  const persistStore = (nextStore: AttachmentStore) => {
    setStore(nextStore);
    localStorage.setItem(buildStorageKey(assistNo), JSON.stringify(nextStore));
  };

  const activeFiles = store[activeFolder] || [];

  const selectedFile = useMemo(() => {
    return activeFiles.find((item) => item.id === selectedFileId) || activeFiles[0] || null;
  }, [activeFiles, selectedFileId]);

  useEffect(() => {
    if (!selectedFile && activeFiles.length > 0) {
      setSelectedFileId(activeFiles[0].id);
    }
  }, [activeFiles, selectedFile]);

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const nextItem: AttachmentItem = {
        id: `${Date.now()}`,
        name: file.name,
        type: file.type,
        dataUrl: String(reader.result || ''),
        uploadedAt: new Date().toLocaleString('zh-CN'),
      };

      const nextStore: AttachmentStore = {
        ...store,
        [activeFolder]: [...(store[activeFolder] || []), nextItem],
      };

      persistStore(nextStore);
      setSelectedFileId(nextItem.id);
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleDeleteFile = (fileId: string) => {
    const nextFiles = activeFiles.filter((item) => item.id !== fileId);
    const nextStore: AttachmentStore = {
      ...store,
      [activeFolder]: nextFiles,
    };

    persistStore(nextStore);

    if (selectedFileId === fileId) {
      setSelectedFileId(nextFiles[0]?.id || '');
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f3f5f7]">
      <div className="h-full border border-slate-300 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="text-sm font-semibold text-slate-900">附件管理</div>
              <div className="mt-0.5 text-xs text-slate-500">理赔协助编号：{assistNo || '--'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500">当前分类：{activeFolder}</div>
            <button
              type="button"
              onClick={handlePickFile}
              className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" />
              上传文件
            </button>
          </div>
        </div>

        <div className="grid h-[calc(100vh-59px)] grid-cols-1 lg:grid-cols-[220px_360px_minmax(0,1fr)]">
          <aside className="border-r border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">分类目录</div>
            <div className="h-[calc(100%-49px)] overflow-y-auto py-1">
              {ATTACHMENT_FOLDERS.map((folder) => {
                const count = store[folder]?.length || 0;
                const isActive = folder === activeFolder;

                return (
                  <button
                    key={folder}
                    type="button"
                    onClick={() => {
                      setActiveFolder(folder);
                      setSelectedFileId((store[folder] || [])[0]?.id || '');
                    }}
                    className={`flex w-full items-center justify-between border-l-2 px-4 py-3 text-left text-sm transition-colors ${
                      isActive
                        ? 'border-l-blue-600 bg-blue-50 text-blue-700'
                        : 'border-l-transparent text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <FolderOpen className="h-4 w-4 shrink-0" />
                      <span className="truncate">{folder}</span>
                    </span>
                    <span className="text-xs text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="border-r border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="text-sm font-semibold text-slate-900">文件列表</div>
              <div className="text-xs text-slate-500">共 {activeFiles.length} 个文件</div>
            </div>

            {activeFiles.length === 0 ? (
              <div className="flex h-[calc(100%-49px)] items-center justify-center px-6 text-center text-sm text-slate-500">
                当前分类暂无文件
              </div>
            ) : (
              <div className="h-[calc(100%-49px)] overflow-y-auto">
                {activeFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`border-b border-slate-100 px-4 py-3 ${
                      selectedFile?.id === file.id ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedFileId(file.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="truncate text-sm font-medium text-slate-800">{file.name}</div>
                        <div className="mt-1 text-xs text-slate-400">{file.uploadedAt}</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(file.id)}
                        className="inline-flex h-7 w-7 items-center justify-center border border-slate-300 text-slate-500 hover:border-rose-300 hover:text-rose-600"
                        title="删除文件"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">文件预览</div>
                <div className="mt-0.5 text-xs text-slate-500">用于快速核对附件内容</div>
              </div>
            </div>

            <div className="h-[calc(100%-57px)] p-5">
              <div className="flex h-full flex-col border border-slate-200 bg-slate-50">
                {selectedFile ? (
                  selectedFile.type.startsWith('image/') ? (
                    <>
                      <div className="border-b border-slate-200 bg-white px-4 py-3">
                        <div className="text-sm font-medium text-slate-900">{selectedFile.name}</div>
                        <div className="mt-1 text-xs text-slate-500">上传时间：{selectedFile.uploadedAt}</div>
                      </div>
                      <div className="flex-1 overflow-auto bg-slate-100 p-4">
                        <img src={selectedFile.dataUrl} alt={selectedFile.name} className="mx-auto block max-h-full max-w-full object-contain" />
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-slate-500">
                      <FileImage className="h-10 w-10 text-slate-300" />
                      <div className="text-sm font-medium text-slate-700">{selectedFile.name}</div>
                      <div className="text-xs text-slate-400">当前文件类型暂不支持在线预览</div>
                    </div>
                  )
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-slate-500">
                    <FileImage className="h-10 w-10 text-slate-300" />
                    <div className="text-sm font-medium text-slate-700">请选择左侧文件查看预览</div>
                    <div className="text-xs text-slate-400">上传后将自动归档到当前分类</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
      </div>
    </div>
  );
}