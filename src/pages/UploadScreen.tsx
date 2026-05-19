import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, X, Sparkles, Cpu, Layers, FileText, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useImageProcessor } from "../hooks/useImageProcessor";

/* ================= AI MULTIMODAL PIPELINE INTERFACES START ================= */
interface UploadedImage {
  id: string;
  url: string;
  status: 'scanning' | 'inpainting' | 'blending' | 'ready';
  progress: number;
  extractedText: string;
  refinedDescription?: string;
  detectedBackground?: "white" | "colored";
  conditionApplied?: string;
}


export default function UploadScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize our brand new custom AI Image Processor hook
  const { processImage, loading: hookLoading, error: hookError } = useImageProcessor();
  
  // Clean Dummy Data: Start with a completely empty state [] for dynamic AI scan pipeline!
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [features, setFeatures] = useState("");

  /* ================= AI PIPELINE SCAN SIMULATION ENGINE START ================= */
  useEffect(() => {
    const activeIntervals = images.map((img) => {
      if (img.status === 'ready') return null;

      const interval = setInterval(() => {
        setImages(prev => prev.map(item => {
          if (item.id !== img.id) return item;

          let nextProgress = item.progress + Math.floor(Math.random() * 15) + 5;
          let nextStatus = item.status;

          if (nextProgress >= 100) {
            nextProgress = 100;
            nextStatus = 'ready';
          } else if (nextProgress >= 75) {
            nextStatus = 'blending';
          } else if (nextProgress >= 40) {
            nextStatus = 'inpainting';
          } else {
            nextStatus = 'scanning';
          }

          return {
            ...item,
            status: nextStatus,
            progress: nextProgress
          };
        }));
      }, 350);

      return { id: img.id, interval };
    });

    return () => {
      activeIntervals.forEach(active => {
        if (active?.interval) clearInterval(active.interval);
      });
    };
  }, [images.filter(img => img.status !== 'ready').length]);
  /* ================= AI PIPELINE SCAN SIMULATION ENGINE END ================= */

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  /* ================= MULTIPLE FILE PROCESSING ENGINE START ================= */
  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(async (file) => {
      const uniqueId = Math.random().toString(36).substring(2, 9) + Date.now();
      const initialUrl = URL.createObjectURL(file);
      
      const newImageItem: UploadedImage = {
        id: uniqueId,
        url: initialUrl,
        status: 'scanning',
        progress: 0,
        extractedText: "AI 텍스트 추출 리소스 스캔 중..."
      };
      
      setImages(prev => [...prev, newImageItem]);

      try {
        // Trigger the AI image process pipeline custom hook concurrently
        const result = await processImage(file, uniqueId);
        
        // Once the AI processor finishes background check & OCR description generation, update the state!
        setImages(prev => prev.map(item => {
          if (item.id === uniqueId) {
            return {
              ...item,
              url: result.processedUrl,
              extractedText: result.extractedText,
              refinedDescription: result.refinedDescription,
              detectedBackground: result.detectedBackground,
              conditionApplied: result.conditionApplied
            };
          }
          return item;
        }));
      } catch (err) {
        console.error("AI Image Processor hook failed:", err);
      }
    });
  };
  /* ================= MULTIPLE FILE PROCESSING ENGINE END ================= */

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [images]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleGenerate = () => {
    // Collect texts extracted from ready images
    const readyExtractedTexts = images
      .filter(img => img.status === 'ready')
      .map(img => img.extractedText);

    const imageOriginalUrls = images.map(img => img.url);

    navigate("/result", { 
      state: { 
        images: imageOriginalUrls, 
        features,
        extractedTexts: readyExtractedTexts
      } 
    });
  };

  // Get status message for the UI loader
  const getStatusText = (status: string) => {
    switch (status) {
      case 'scanning': return 'AI 텍스트 정밀 스캔 중 (OCR)...';
      case 'inpainting': return '나노바나나 2 텍스트 지우는 중...';
      case 'blending': return '배경 텍스처 합성 및 보정 중...';
      case 'ready': return '배경 합성 & 텍스트 자원화 완료!';
      default: return '대기 중...';
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 w-full">
      <div className="text-center md:text-left">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 flex items-center gap-2 justify-center md:justify-start">
          <Cpu className="text-primary-container shrink-0 animate-pulse" />
          네이버 상세페이지 SEO 최적화 매니저
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          상품 이미지 속 불필요한 글자를 감쪽같이 지우고, 추출된 텍스트 자원과 특징을 병합하여 상위 노출 템플릿을 생성합니다.
        </p>
      </div>

      <div className="bg-surface-container-lowest p-card-padding rounded-xl border border-outline-variant shadow-sm flex flex-col gap-8">
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />

        {/* AI Background Processing Hook Loader & Error Notification Panel */}
        {(hookLoading || hookError) && (
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-outline-variant/40 bg-surface-container shadow-sm animate-fade-in">
            {hookLoading && (
              <div className="flex items-center gap-3 text-primary text-sm font-bold">
                <Sparkles size={16} className="animate-spin text-primary-container" />
                <span>AI 가공 파이프라인 연동 중... (배경색 판별 및 OCR 텍스트 정제 중)</span>
              </div>
            )}
            {hookError && (
              <div className="flex items-center gap-3 text-error text-sm font-bold">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>AI 이미지 처리 오류: {hookError}</span>
              </div>
            )}
          </div>
        )}

        {/* Upload Zone */}
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">이미지 업로드</h2>
          <div 
            onClick={triggerFileSelect}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
              ${isDragging ? 'border-primary bg-primary-container/5' : 'border-outline-variant hover:border-primary/50'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 text-primary">
              <Upload size={32} />
            </div>
            <p className="font-body-lg text-body-lg text-on-surface font-medium mb-1">여기로 이미지를 드래그 앤 드롭 하세요</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">또는 클릭하여 파일을 컴퓨터에서 선택하세요 (최대 10장)</p>
          </div>
        </div>

        {/* Dynamic Preview Grid with AI Pipeline Loader */}
        <div>
          <h3 className="font-label-bold text-label-bold text-on-surface-variant mb-4">
            업로드된 이미지 리소스 ({images.length})
          </h3>
          
          {images.length === 0 ? (
            /* ================= CLEAN EMPTY STATE PLACEHOLDER START ================= */
            <div className="border border-outline-variant/30 rounded-xl bg-surface-container p-12 text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">add_photo_alternate</span>
              <p className="font-label-bold text-label-bold text-on-surface-variant">업로드된 상품 이미지가 없습니다.</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant/70 max-w-xs">
                위 업로드 존을 클릭하거나 상품 통이미지/낱개 파일을 끌어다 놓으시면 AI 멀티모달 스캐너가 즉각 작동합니다.
              </p>
            </div>
            /* ================= CLEAN EMPTY STATE PLACEHOLDER END ================= */
          ) : (
            /* ================= AI DYNAMIC LOADER GRID START ================= */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {images.map((img) => (
                <div key={img.id} className="relative rounded-lg border border-outline-variant overflow-hidden bg-surface flex h-32 group shadow-sm">
                  {/* Left: Product Thumbnail */}
                  <div className="w-32 h-full bg-surface-container-high relative shrink-0">
                    <img src={img.url} alt="Uploaded thumbnail" className="w-full h-full object-cover" />
                    {img.status === 'ready' && (
                      <div className="absolute top-1.5 left-1.5 bg-primary-container text-on-primary rounded-full p-1 shadow-sm">
                        <CheckCircle2 size={12} />
                      </div>
                    )}
                  </div>
                  
                  {/* Right: AI OCR Scan Pipeline UI */}
                  <div className="flex-grow p-4 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                            ${img.status === 'ready' ? 'bg-primary-container/15 text-primary-container' : 'bg-secondary-container text-on-secondary'}`}>
                            {img.status}
                          </span>
                          <span className="text-[11px] text-on-surface-variant font-medium">Progress: {img.progress}%</span>
                        </div>
                        <p className="font-label-bold text-[12px] text-on-surface truncate mt-1">
                          {getStatusText(img.status)}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                        className="text-on-surface-variant hover:text-error hover:bg-surface-container p-1 rounded-full transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full">
                      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 rounded-full
                            ${img.status === 'ready' ? 'bg-primary-container' : 'bg-primary-container-high'}`}
                          style={{ width: `${img.progress}%` }}
                        />
                      </div>
                      
                      {/* Subtitle / OCR Text Resource badge preview when ready */}
                      {img.status === 'ready' ? (
                        <div className="flex flex-col gap-0.5 mt-1">
                          <p className="text-[11px] text-primary font-medium truncate flex items-center gap-1">
                            <Sparkles size={10} className="shrink-0" />
                            추출 완료: "{img.extractedText.replace('### ', '').substring(0, 25)}..."
                          </p>
                          {img.conditionApplied && (
                            <span className="text-[9px] font-bold text-on-surface-variant/80 bg-surface-container-high/60 border border-outline-variant/30 rounded px-1.5 py-0.5 w-fit">
                              {img.conditionApplied === "Condition A (Cropped & Upscaled)" 
                                ? "⚡ A조건: 흰색배경 크롭 & 업스케일 적용됨" 
                                : "🎨 B조건: 유색배경 Inpainting 보정 적용됨"}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-[10px] text-on-surface-variant/70 mt-1 italic animate-pulse">
                          나노바나나 2 이미지 편집 합성 중...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            /* ================= AI DYNAMIC LOADER GRID END ================= */
          )}
        </div>

        {/* Text Area */}
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">상품 주요 특징 입력 (선택)</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
            설명이 없거나 빈 상태로 두셔도 AI 비전 모델이 업로드된 상품 이미지의 모양과 특징을 자동 인지하여 설명글을 도출합니다.
          </p>
          <textarea 
            className="w-full min-h-[120px] p-input-padding rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md resize-y"
            placeholder={`상품의 핵심 사양이나 상세 설명을 여기에 적어주세요.\n비워둘 시 멀티모달 이미지 비전 분석에 의한 자동 텍스트 생성이 적용됩니다.`}
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </div>

        {/* ================= PROMPT MERGE DIAGNOSTIC ENGINE CARD START ================= */}
        {images.length > 0 && (
          <section className="border border-outline-variant/40 rounded-xl bg-surface-container p-5 flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-outline-variant/50 pb-2">
              <Layers size={18} className="text-primary-container animate-pulse" />
              <h3 className="font-label-bold text-label-bold text-on-surface">AI 멀티모달 프롬프트 빌더 (Merge Engine)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              
              {/* Box 1: Manual text */}
              <div className="bg-white p-4 rounded-lg border border-outline-variant/20 shadow-sm flex flex-col gap-1.5 h-28">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">InputText (수동 특징 입력)</span>
                <p className="text-[12px] text-on-surface line-clamp-3">
                  {features.trim().length > 0 ? features : "(비어 있음 - AI 비전 자동 분석 활성화)"}
                </p>
              </div>

              {/* Plus icon */}
              <div className="flex justify-center text-on-surface-variant/40 font-bold text-lg select-none">
                + (Merge)
              </div>

              {/* Box 2: Extracted OCR text */}
              <div className="bg-white p-4 rounded-lg border border-outline-variant/20 shadow-sm flex flex-col gap-1.5 h-28 overflow-y-auto custom-scrollbar">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={12} />
                  ExtractedText (이미지 추출 자원)
                </span>
                <ul className="text-[11px] text-on-surface-variant flex flex-col gap-1">
                  {images.map((img, idx) => (
                    <li key={img.id} className="truncate">
                      {img.status === 'ready' 
                        ? `📷 이미지 #${idx + 1}: ${img.extractedText.replace('### ', '')}`
                        : `⏳ 이미지 #${idx + 1}: 추출 진행 중...`}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Combined Context Terminal */}
            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-[11px] text-green-400 flex flex-col gap-1 max-h-32 overflow-y-auto">
              <span className="text-zinc-500 font-bold flex items-center gap-1.5 border-b border-zinc-800 pb-1 mb-1">
                <FileText size={12} />
                FINAL CONTEXT PROMPT FOR GEMINI 3 FLASH
              </span>
              <p className="whitespace-pre-wrap leading-relaxed">
                {`[Manual Input]: ${features.trim() || "(Empty - VISION context mode on)"}\n\n[OCR Resources]:\n${
                  images
                    .filter(i => i.status === 'ready')
                    .map((i, idx) => `Img #${idx + 1} extracted text:\n${i.extractedText}\nImg #${idx + 1} refined desc:\n${i.refinedDescription || ""}`)
                    .join('\n') || "(No extracted resources yet - waiting for ready images)"
                }`}
              </p>
            </div>
          </section>
        )}
        {/* ================= PROMPT MERGE DIAGNOSTIC ENGINE CARD END ================= */}

        <div className="flex justify-end pt-4 border-t border-outline-variant">
          <button 
            onClick={handleGenerate}
            disabled={images.some(img => img.status !== 'ready') || images.length === 0}
            className="flex items-center justify-center gap-2 bg-primary-container text-on-primary font-label-bold text-label-bold py-3 px-8 rounded-lg hover:brightness-95 disabled:bg-surface-container disabled:text-on-surface-variant/40 disabled:cursor-not-allowed transition-all shadow-sm text-lg"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            상세페이지 생성하기
          </button>
        </div>

      </div>
    </div>
  );
}
