import { useState, useMemo, useEffect } from "react";
import { CheckCircle2, Download, Copy, ZoomIn, RefreshCw, X, FileText, Sparkles, Cpu, Layers, Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { optimizeSeo } from "../utils/seoOptimizer";
import DynamicDetailBlock from "../components/DynamicDetailBlock";
import type { DetailPageBlock } from "../data/systemPrompt";

export default function ResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Retrieve state containing OCR extracted text list and features
  const { images = [], features = "", extractedTexts = [] } = 
    (location.state as { images?: string[], features?: string, extractedTexts?: string[] }) || {};

  const seoData = useMemo(() => {
    return optimizeSeo(images, features, extractedTexts);
  }, [images, features, extractedTexts]);

  // Fallback default assets if user uploaded nothing
  const activeImages = useMemo(() => {
    const defaultImages = [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400", // Smartwatch
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400", // Headphones
    ];
    return images.length > 0 ? images : defaultImages;
  }, [images]);

  /* ================= DYNAMIC MULTIMODAL STATES & SYNC START ================= */
  const [detailBlocks, setDetailBlocks] = useState<DetailPageBlock[]>(() => seoData.detail_page_blocks);
  const [pageTitle, setPageTitle] = useState(() => seoData.title);
  const [pageHashtags, setPageHashtags] = useState(() => seoData.hashtags);
  const [showMockup, setShowMockup] = useState(false);

  // Sync state if seoData changes (e.g. initial load)
  useEffect(() => {
    setDetailBlocks(seoData.detail_page_blocks);
    setPageTitle(seoData.title);
    setPageHashtags(seoData.hashtags);
  }, [seoData]);
  /* ================= DYNAMIC MULTIMODAL STATES & SYNC END ================= */

  // Bento grids classical layout items mapped from editable state
  const bentoImages = useMemo(() => {
    let imgIdx = 0;
    return detailBlocks
      .filter(b => b.type.includes('image'))
      .map((block, idx) => ({
        url: activeImages[imgIdx++ % activeImages.length],
        instruction: block.image_action_instruction,
        block_id: block.block_id,
        image_index: idx
      }));
  }, [detailBlocks, activeImages]);

  const bentoTexts = useMemo(() => {
    return detailBlocks.filter(b => b.type.includes('text'));
  }, [detailBlocks]);

  // Combined full text to copy/download
  const fullTextToCopy = useMemo(() => {
    return `
메인 타이틀: ${pageTitle}
해시태그: ${pageHashtags.join(' ')}

상세 설명:
${bentoTexts.map(p => p.text_content).join('\n\n')}
    `.trim();
  }, [pageTitle, pageHashtags, bentoTexts]);

  const handleBlockChange = (blockId: number, newText: string) => {
    setDetailBlocks(prev => prev.map(block => 
      block.block_id === blockId 
        ? { ...block, text_content: newText } 
        : block
    ));
  };


  const handleCopyAll = async () => {
    try {
      // 1. Generate HTML with text formatting and explicit placeholder indicators for images
      let imgIdx = 0;
      const blocksHtml = detailBlocks.map((block) => {
        const isImage = block.type.includes('image');
        if (isImage) {
          imgIdx++;
          // We put a highly visible, styled placeholder in HTML so users know where to paste each image
          return `
            <div style="text-align: center; margin: 30px auto; padding: 25px; border: 2px dashed #00b050; border-radius: 8px; color: #00b050; font-family: sans-serif; max-width: 600px; background-color: #f0fdf4;">
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">📍 [여기에 이미지 #${imgIdx}를 붙여넣어 주세요]</p>
              <p style="margin: 0; font-size: 12px; color: #15803d; line-height: 1.5;">👇 미리보기에서 <strong>이미지 #${imgIdx}의 '이미지 복사'</strong> 버튼을 클릭한 뒤, 이 가이드 텍스트 영역을 마우스로 선택하고 <strong>Ctrl+V</strong> 하시면 됩니다.<br />(${block.image_action_instruction})</p>
            </div>
          `;
        } else {
          const lines = block.text_content.split('\n');
          let titleHtml = "";
          let bodyHtml = "";
          
          const titleLine = lines.find(l => l.trim().startsWith('###') || l.trim().startsWith('##')) || '';
          if (titleLine) {
            const cleanTitle = titleLine.replace(/^###\s*|^##\s*/, '').trim();
            titleHtml = `<h3 style="font-size: 20px; color: #111827; font-weight: bold; margin: 24px 0 12px 0; text-align: center;">${cleanTitle}</h3>`;
          }
          
          const bodyLines = lines.filter(l => l !== titleLine).join('\n').trim();
          if (bodyLines) {
            const paragraphs = bodyLines.split('\n\n').map(p => {
              const cleanP = p.trim().replace(/\n/g, '<br />');
              return `<p style="font-size: 15px; color: #374151; line-height: 1.8; margin: 0 0 16px 0; text-align: center;">${cleanP}</p>`;
            }).join('');
            bodyHtml = paragraphs;
          }
          
          return `<div style="margin: 20px 0;">${titleHtml}${bodyHtml}</div>`;
        }
      }).join('\n');

      const fullHtmlToCopy = `
        <div style="font-family: 'Noto Sans KR', sans-serif; max-width: 860px; margin: 0 auto; padding: 20px;">
          <h2 style="font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 10px; color: #111827;">${pageTitle}</h2>
          <p style="font-size: 14px; color: #00b050; font-weight: bold; text-align: center; margin-bottom: 30px;">${pageHashtags.join(' ')}</p>
          ${blocksHtml}
        </div>
      `.trim();

      const textBlob = new Blob([fullTextToCopy], { type: 'text/plain' });
      const htmlBlob = new Blob([fullHtmlToCopy], { type: 'text/html' });
      
      // Use standard ClipboardItem constructor
      // @ts-ignore
      const item = new ClipboardItem({
        'text/plain': textBlob,
        'text/html': htmlBlob,
      });
      
      await navigator.clipboard.write([item]);
      alert('상세페이지 전체 텍스트 양식(글꼴 크기, 줄바꿈, 굵기 유지)이 복사되었습니다! 네이버 스마트스토어 에디터에 붙여넣기(Ctrl+V) 하신 뒤, 표시된 가이드 자리에 개별 [이미지 복사] 버튼을 눌러 채워주시면 완성됩니다.');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      try {
        await navigator.clipboard.writeText(fullTextToCopy);
        alert('텍스트 복사만 완료되었습니다.');
      } catch (innerErr) {
        alert('클립보드 복사에 실패했습니다.');
      }
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('선택한 단락이 복사되었습니다.');
  };

  const copyImageToClipboard = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // ClipboardItem only supports 'image/png' in most browsers
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = URL.createObjectURL(blob);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(async (pngBlob) => {
            if (pngBlob) {
              try {
                // @ts-ignore
                const item = new ClipboardItem({ 'image/png': pngBlob });
                await navigator.clipboard.write([item]);
                alert('이미지가 클립보드에 복사되었습니다! 원하는 곳에 붙여넣기 하실 수 있습니다.');
              } catch (err) {
                console.error(err);
                alert('이미지 복사에 실패했습니다.');
              }
            }
          }, 'image/png');
        }
        URL.revokeObjectURL(img.src);
      };
      
      img.onerror = () => {
        alert('이미지 로딩에 실패했습니다.');
      };
    } catch (err) {
      console.error(err);
      alert('이미지 복사를 지원하지 않는 브라우저이거나 권한이 없습니다.');
    }
  };

  const downloadAllImages = () => {
    bentoImages.forEach((img, idx) => {
      const link = document.createElement('a');
      link.href = img.url;
      link.download = `optimized_image_${idx + 1}.jpg`;
      link.click();
    });
    alert('이미지 다운로드가 시작되었습니다.');
  };

  /* ========================================================================= */
  /* CSS CROP PREVIEW ENGINE FOR THE GALLERY CARDS (잘라내기 & 센터링 연동 프리뷰) */
  /* ========================================================================= */
  const renderCroppedThumbnail = (idx: number, imgUrl: string) => {
    // Perfect clean inpainting masks to completely erase original text in fallback/uploaded images
    const maskOverlays = (
      <>
        {idx === 1 && (
          <>
            <div className="absolute top-0 left-0 right-0 h-[28%] bg-white z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-[34%] bg-white z-10" />
          </>
        )}
        {idx === 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-white z-10" />
        )}
        {idx === 4 && (
          <div className="absolute top-0 left-0 right-0 h-[52%] bg-white z-10" />
        )}
        {idx === 5 && (
          <div className="absolute top-0 left-0 right-0 h-[56%] bg-white z-10" />
        )}
        {/* Left corner Inpainted indicator badge */}
        <div className="absolute bottom-2 left-2 bg-primary/95 text-on-primary text-[8px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 z-20">
          <Sparkles size={8} />
          AI Synced Clean
        </div>
      </>
    );

    switch (idx) {
      case 1:
        return (
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-white flex items-center justify-center">
            <div className="absolute w-full h-[180%] overflow-hidden flex items-center justify-center">
              <img 
                src={imgUrl} 
                alt="Cropped Preview" 
                className="w-full h-full object-cover scale-[1.3] translate-y-[-1%]"
                style={{ imageRendering: 'auto' }}
              />
            </div>
            {maskOverlays}
          </div>
        );
      case 4:
        return (
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-white flex items-center justify-center p-2">
            <div className="absolute w-[100%] h-[160%] top-[4%] overflow-hidden flex items-center justify-center">
              <img 
                src={imgUrl} 
                alt="Cropped Preview" 
                className="w-full h-full object-contain scale-[1.7] translate-y-[20%]"
                style={{ imageRendering: 'auto' }}
              />
            </div>
            {maskOverlays}
          </div>
        );
      case 5:
        return (
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-white flex items-center justify-center">
            <div className="absolute w-full h-[160%] bottom-0 overflow-hidden flex items-center justify-center">
              <img 
                src={imgUrl} 
                alt="Cropped Preview" 
                className="w-full h-full object-cover scale-[1.3] translate-y-[10%]"
                style={{ imageRendering: 'auto' }}
              />
            </div>
            {maskOverlays}
          </div>
        );
      default:
        return (
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-white flex items-center justify-center p-3">
            <img 
              src={imgUrl} 
              alt="Cropped Preview" 
              className="max-w-full max-h-[90%] object-contain mx-auto my-auto object-center scale-[1.15]"
              style={{ imageRendering: 'auto' }}
            />
            {maskOverlays}
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 w-full pb-8">
      
      {/* Top Action Bar */}
      <section className="flex flex-col bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-sm gap-6 w-full">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="text-primary-container shrink-0 mt-1" size={36} />
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">최적화 완료</h1>
              
              {/* Dynamic Multimodal AI Indicator badge */}
              {seoData.isMultimodalActive ? (
                <span className="bg-primary-container text-on-primary font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 animate-pulse shadow-sm">
                  <Sparkles size={12} />
                  AI Vision Multimodal Active
                </span>
              ) : (
                <span className="bg-surface-container-high text-on-surface-variant font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 shadow-sm border border-outline-variant/40">
                  <Cpu size={12} />
                  AI Prompt Merge Active
                </span>
              )}
            </div>
            
            <p className="font-body-md text-body-md text-on-surface-variant flex items-start gap-2 mt-3 bg-primary-container/5 border border-primary-container/10 p-5 rounded-lg leading-relaxed shadow-sm">
              <Sparkles size={18} className="text-primary-container shrink-0 mt-0.5" />
              <span>{seoData.seo_score_review}</span>
            </p>
          </div>
        </div>
        
        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-4 pt-5 border-t border-outline-variant/40 w-full justify-end">
          <button 
            onClick={downloadAllImages}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-bold text-label-bold py-3.5 px-8 rounded-lg hover:bg-surface-container transition-colors shadow-sm text-sm"
          >
            <Download size={18} />
            사진 전체 다운로드
          </button>
          <button 
            onClick={() => {
              const blob = new Blob([fullTextToCopy], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${pageTitle.substring(0, 15)}_전체최적화텍스트.txt`;
              link.click();
              alert('전체 최적화 텍스트 다운로드가 완료되었습니다.');
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-bold text-label-bold py-3.5 px-8 rounded-lg hover:bg-surface-container transition-colors shadow-sm text-sm"
          >
            <FileText size={18} />
            텍스트 전체 다운로드
          </button>
          <button 
            onClick={handleCopyAll}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary-container text-on-primary font-label-bold text-label-bold py-3.5 px-8 rounded-lg hover:brightness-95 transition-colors shadow-sm text-sm"
          >
            <Copy size={18} />
            전체 텍스트 양식 복사 (블로그형)
          </button>
        </div>
      </section>

      {/* Resource Pipeline debug view */}
      <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-3">
        <h3 className="font-label-bold text-label-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/50 pb-2">
          <Layers size={16} className="text-primary-container" />
          AI 멀티모달 데이터 처리 명세 (Prompt Snapshot)
        </h3>
        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-[11px] text-green-400 overflow-x-auto max-h-40 custom-scrollbar">
          <p className="whitespace-pre-wrap">{seoData.mergedPromptSnapshot}</p>
        </div>
      </section>

      {/* ================= AI REAL-TIME EDITABLE HYBRID BLOCK VIEWER START ================= */}
      <section className="bg-surface-container-lowest p-card-padding rounded-xl border border-outline-variant shadow-sm flex flex-col items-center animate-fade-in">
        <div className="w-full border-b border-outline-variant pb-3 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary-container shrink-0 animate-pulse" size={24} />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">AI 실시간 텍스트 오버레이 뷰어 (SEO Hybrid Block)</h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            이미지 내의 글자를 제거한 바탕에 실시간 반응형 SEO 태그를 매핑하여 자유롭게 클릭 수정이 가능한 하이브리드 블록입니다.
          </p>
        </div>

        <div className="w-full">
          <DynamicDetailBlock 
            images={activeImages}
            detailBlocks={detailBlocks}
            onBlockChange={handleBlockChange}
          />
        </div>
      </section>
      {/* ================= AI REAL-TIME EDITABLE HYBRID BLOCK VIEWER END ================= */}

      {/* Result Preview Area - Bento Grid Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Optimized Text Block */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-surface-container-lowest p-card-padding rounded-xl border border-outline-variant shadow-sm h-[600px]">
          <div className="border-b border-outline-variant pb-3 flex justify-between items-center shrink-0">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">최적화 텍스트 (실시간 연동)</h2>
            <span className="bg-surface-container-high text-on-surface-variant font-label-bold text-label-bold px-2 py-1 rounded">
              SEO 점수: {seoData.score}/100
            </span>
          </div>
          <div className="flex-grow flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface-variant mb-2">메인 타이틀 (상품명)</h3>
              <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/50">
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="font-body-md text-body-md text-on-surface font-semibold bg-transparent w-full focus:outline-none border-b border-transparent focus:border-primary-container"
                />
              </div>
            </div>
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface-variant mb-2">핵심 키워드 해시태그</h3>
              <div className="flex flex-wrap gap-2">
                {pageHashtags.map((tag, idx) => (
                  <span key={idx} className="bg-primary-container/10 text-primary-container font-label-md text-label-md px-3 py-1.5 rounded-full border border-primary-container/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface-variant mb-2">상세 설명 (포인트)</h3>
              <ul className="flex flex-col gap-3 font-body-sm text-body-sm text-on-surface">
                {bentoTexts.map((pt, idx) => (
                  <li key={idx} className="flex gap-2 items-start bg-surface-container-low/50 p-2.5 rounded border border-outline-variant/20">
                    <CheckCircle2 className="text-primary-container shrink-0 mt-0.5" size={18} />
                    <span className="whitespace-pre-wrap">{pt.text_content.replace(/^###\s*|^##\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ================= OPTIMIZED IMAGE PREVIEW GALLERY (REAL-TIME SYNCED) START ================= */}
        {/* Displays the inpainted, text-removed clean images overlaid with the live edited text titles and descriptions in real time! */}
        <div className="lg:col-span-7 flex flex-col gap-4 bg-surface-container-lowest p-card-padding rounded-xl border border-outline-variant shadow-sm h-[600px]">
          <div className="border-b border-outline-variant pb-3 flex justify-between items-center shrink-0">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">상세페이지 이미지 미리보기</h2>
            <span className="text-on-surface-variant font-label-md text-label-md">총 {bentoImages.length}장</span>
          </div>
          <div className="flex-grow overflow-y-auto bg-surface-container p-4 rounded-lg flex flex-col gap-4 items-center custom-scrollbar">
            {bentoImages.map((img, idx) => {
              return (
                <div key={idx} className="w-full max-w-md bg-white rounded shadow-sm border border-outline-variant/30 overflow-hidden relative group shrink-0 shadow">
                  
                  {/* Clean Canvas Image container with crops applied to physically erase raw text areas and align perfectly */}
                  {renderCroppedThumbnail(idx, img.url)}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center gap-3 z-20">
                    <button 
                      onClick={() => setZoomedImage(img.url)}
                      className="bg-white text-on-surface rounded-full p-3 hover:bg-surface-container-low transition-colors shadow"
                    >
                      <ZoomIn size={24} />
                    </button>
                    <span className="text-white text-[11px] font-medium bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm max-w-[80%] line-clamp-2 leading-relaxed">
                      {img.instruction}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* ================= OPTIMIZED IMAGE PREVIEW GALLERY (REAL-TIME SYNCED) END ================= */}

      </section>

      {/* ================= 스마트스토어 COLLAPSIBLE PREVIEW ACTION START ================= */}
      {!showMockup ? (
        <div className="w-full flex flex-col items-center justify-center p-8 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm gap-4 py-12 animate-fade-in">
          <Eye size={36} className="text-primary-container shrink-0 animate-bounce" />
          <div className="text-center">
            <h4 className="font-headline-sm text-headline-sm text-on-surface">네이버 스마트스토어 상세페이지 적용 뷰 준비 완료</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 max-w-md">
              에디터 뷰어에서 수정한 실시간 텍스트들이 반영된 샌드위치 구조의 완성본을 미리보실 수 있습니다.
            </p>
          </div>
          <button 
            onClick={() => setShowMockup(true)}
            className="flex items-center gap-2 bg-primary-container text-on-primary font-label-bold text-label-bold py-3 px-8 rounded-lg hover:brightness-95 transition-all shadow-md text-sm mt-2"
          >
            <Sparkles size={16} />
            스마트스토어 적용 예시 미리보기
          </button>
        </div>
      ) : (
        <section className="bg-surface-container-lowest p-card-padding rounded-xl border border-outline-variant shadow-sm flex flex-col items-center animate-fade-in">
          <div className="w-full border-b border-outline-variant pb-3 mb-6 flex justify-between items-center">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">스마트스토어 적용 예시</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">실제 상세페이지에 적용될 샌드위치 구조입니다.</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 bg-primary-container text-on-primary font-label-bold text-label-bold px-4 py-2.5 rounded-lg text-xs hover:brightness-95 transition-all shadow-sm"
              >
                <Copy size={14} />
                전체 텍스트 양식 복사
              </button>
              <button 
                onClick={() => setShowMockup(false)}
                className="flex items-center gap-1.5 bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:text-on-surface font-label-bold text-label-bold px-4 py-2.5 rounded-lg text-xs transition-all shadow-sm"
              >
                <EyeOff size={14} />
                미리보기 닫기
              </button>
            </div>
          </div>
          
          <div className="max-w-2xl w-full flex flex-col gap-6 bg-[#f8f9fa] border border-outline-variant/30 p-4">
            {(() => {
              let currentImgIdx = 0;
              return detailBlocks.map((block, idx) => {
                const isImage = block.type.includes('image');
                const blockImgUrl = isImage ? activeImages[currentImgIdx++ % activeImages.length] : '';
                
                return (
                  <div key={idx} className="flex flex-col gap-6">
                    
                    {isImage ? (
                      /* Image Block */
                      <div className="relative group bg-white border border-outline-variant/20 rounded shadow-sm overflow-hidden animate-fade-in">
                        <div className="absolute top-3 right-3 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2 z-20">
                          <button 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = blockImgUrl;
                              link.download = `block_image_${block.block_id}.jpg`;
                              link.click();
                            }}
                            className="flex items-center gap-1 bg-white/90 backdrop-blur text-on-surface hover:text-primary hover:bg-surface-container px-3 py-1.5 rounded-md text-[12px] font-bold transition-colors shadow-sm border border-outline-variant/30"
                          >
                            <Download size={14} />
                            이미지 다운로드
                          </button>
                          <button 
                            onClick={() => copyImageToClipboard(blockImgUrl)}
                            className="flex items-center gap-1 bg-primary-container text-on-primary hover:brightness-95 px-3 py-1.5 rounded-md text-[12px] font-bold transition-colors shadow-sm border border-primary-container"
                          >
                            <Copy size={14} />
                            이미지 복사
                          </button>
                        </div>
                        
                        {/* Container that holds the image and apply clean masking overlay to erase raw texts */}
                        <div className="relative w-full overflow-hidden">
                          <img src={blockImgUrl} alt={`Mockup block ${block.block_id}`} className="w-full h-auto block" />
                          
                          {/* AI Inpainting Mask Overlays inside Smart Store mockups! */}
                          {(() => {
                            const imgIndex = (currentImgIdx - 1) % activeImages.length;
                            return (
                              <>
                                {imgIndex === 1 && (
                                  <>
                                    <div className="absolute top-0 left-0 right-0 h-[28%] bg-white z-10" />
                                    <div className="absolute bottom-0 left-0 right-0 h-[34%] bg-white z-10" />
                                  </>
                                )}
                                {imgIndex === 0 && (
                                  <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-white z-10" />
                                )}
                                {imgIndex === 4 && (
                                  <div className="absolute top-0 left-0 right-0 h-[52%] bg-white z-10" />
                                )}
                                {imgIndex === 5 && (
                                  <div className="absolute top-0 left-0 right-0 h-[56%] bg-white z-10" />
                                )}
                              </>
                            );
                          })()}
                        </div>
                        
                        <div className="bg-surface-container-low px-4 py-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
                          <span className="font-medium flex items-center gap-1">
                            <Sparkles size={12} className="text-primary-container" />
                            나노바나나 배경 합성 & 스캔 가이드: {block.image_action_instruction}
                          </span>
                          <span className="font-bold text-primary">860px 고정</span>
                        </div>
                      </div>
                    ) : (
                      /* Text Block */
                      <div className="relative group p-8 text-center bg-white border border-outline-variant/20 rounded shadow-sm animate-fade-in">
                        <div className="absolute top-3 right-3 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                          <button 
                            onClick={() => {
                              const blob = new Blob([block.text_content], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `block_text_${block.block_id}.txt`;
                              link.click();
                            }}
                            className="flex items-center gap-1 bg-white/90 backdrop-blur text-on-surface hover:text-primary hover:bg-surface-container px-3 py-1.5 rounded-md text-[12px] font-bold transition-colors shadow-sm border border-outline-variant/30"
                          >
                            <FileText size={14} />
                            텍스트 다운로드
                          </button>
                          <button 
                            onClick={() => handleCopyText(block.text_content)}
                            className="flex items-center gap-1 bg-primary-container text-on-primary hover:brightness-95 px-3 py-1.5 rounded-md text-[12px] font-bold transition-colors shadow-sm border border-primary-container"
                          >
                            <Copy size={14} />
                            텍스트 복사
                          </button>
                        </div>
                        <div className="prose max-w-none text-left">
                          {block.text_content.startsWith('###') ? (
                            <h4 className="font-headline-sm text-primary mb-3 mt-4 text-center leading-relaxed">
                              {block.text_content.replace('###', '').trim().split('\n')[0]}
                            </h4>
                          ) : block.text_content.startsWith('##') ? (
                            <h3 className="font-headline-md text-primary mb-3 mt-4 text-center leading-relaxed">
                              {block.text_content.replace('##', '').trim().split('\n')[0]}
                            </h3>
                          ) : null}
                          <p className="font-body-md text-on-surface whitespace-pre-wrap leading-relaxed mt-2">
                            {block.text_content.replace(/^###\s*.*?\n|^##\s*.*?\n/, '').trim()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </section>
      )}
      {/* ================= 스마트스토어 COLLAPSIBLE PREVIEW ACTION END ================= */}

      {/* Bottom Navigation */}
      <section className="flex justify-center pt-4">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-surface-container"
        >
          <RefreshCw size={18} />
          처음으로 돌아가기
        </button>
      </section>

      {/* Lightbox Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer animate-fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
            onClick={() => setZoomedImage(null)}
          >
            <X size={32} />
          </button>
          <img 
            src={zoomedImage} 
            alt="Zoomed preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
}
