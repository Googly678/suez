import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, FileImage, FileText, FolderOpen, Trash2, Upload } from 'lucide-react';

const PHOTO_FOLDERS = ['客户身份证明', '车辆证明', '营业收入证明', '货物图片', '其他'] as const;

type PhotoFolder = (typeof PHOTO_FOLDERS)[number];

type AttachmentItem = {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  uploadedAt: string;
};

type AttachmentStore = Partial<Record<PhotoFolder, AttachmentItem[]>>;

const buildPhotoStorageKey = (inquiryNo: string) => `inquiry_photos_${inquiryNo}`;

export default function InquiryAttachmentManager({
  inquiryNo,
  onClose,
}: {
  inquiryNo: string;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeFolder, setActiveFolder] = useState<PhotoFolder>('客户身份证明');
  const [store, setStore] = useState<AttachmentStore>({});
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [pdfData, setPdfData] = useState<string>('');
  const [pdfName, setPdfName] = useState<string>('询价单附件.pdf');

  useEffect(() => {
    if (!inquiryNo) {
      return;
    }

    const inquiryRaw = localStorage.getItem(`inquiry_${inquiryNo}`);
    if (inquiryRaw) {
      try {
        const inquiry = JSON.parse(inquiryRaw);
        setPdfData(inquiry.attachmentData || '');
        setPdfName(inquiry.attachmentName || '询价单附件.pdf');
      } catch {
        setPdfData('');
      }
    }

    const raw = localStorage.getItem(buildPhotoStorageKey(inquiryNo));
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AttachmentStore;
      setStore(parsed);

      for (const folder of PHOTO_FOLDERS) {
        const firstFile = parsed[folder]?.[0];
        if (firstFile) {
          setActiveFolder(folder);
          setSelectedFileId(firstFile.id);
          break;
        }
      }
    } catch {
      setStore({});
    }
  }, [inquiryNo]);

  const persistStore = (nextStore: AttachmentStore) => {
    setStore(nextStore);
    localStorage.setItem(buildPhotoStorageKey(inquiryNo), JSON.stringify(nextStore));
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
    if (!file) {
      return;
    }

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
              <div className="text-sm font-semibold text-slate-900">询价单附件</div>
              <div className="mt-0.5 text-xs text-slate-500">询价单编号：{inquiryNo || '--'}</div>
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
              上传照片
            </button>
          </div>
        </div>

        <div className="grid h-[calc(100vh-59px)] grid-cols-1 lg:grid-cols-[220px_340px_minmax(0,1fr)]">
          <aside className="border-r border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">图片分类</div>
            <div className="h-[calc(100%-49px)] overflow-y-auto py-1">
              {PHOTO_FOLDERS.map((folder) => {
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
              <div className="text-sm font-semibold text-slate-900">照片列表</div>
              <div className="text-xs text-slate-500">共 {activeFiles.length} 张</div>
            </div>

            {activeFiles.length === 0 ? (
              <div className="flex h-[calc(100%-49px)] items-center justify-center px-6 text-center text-sm text-slate-500">
                当前分类暂无图片
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
                        title="删除图片"
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
            <div className="grid h-full grid-rows-[52%_48%]">
              <div className="border-b border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">客户问询单 PDF</div>
                    <div className="mt-0.5 text-xs text-slate-500">客户提交后自动生成，可用于核对原文</div>
                  </div>
                  {pdfData ? (
                    <a
                      href={pdfData}
                      download={pdfName}
                      className="inline-flex items-center gap-1.5 border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      下载PDF
                    </a>
                  ) : null}
                </div>
                <div className="h-[calc(100%-57px)] bg-slate-50 p-4">
                  {pdfData ? (
                    <iframe title="询价单PDF预览" src={pdfData} className="h-full w-full border border-slate-200 bg-white" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 border border-dashed border-slate-300 text-slate-500">
                      <FileText className="h-10 w-10 text-slate-300" />
                      <div className="text-sm">暂无客户回填的 PDF 询价单</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">图片预览</div>
                    <div className="mt-0.5 text-xs text-slate-500">用于快速核对上传照片内容</div>
                  </div>
                </div>

                <div className="h-[calc(100%-57px)] p-4">
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
                        <div className="text-sm font-medium text-slate-700">请选择左侧图片查看预览</div>
                        <div className="text-xs text-slate-400">上传后将自动归档到当前分类</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
    </div>
  );
}
