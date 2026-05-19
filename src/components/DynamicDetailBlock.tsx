import { useState } from "react";
import { Sparkles, AlertCircle, Layers } from "lucide-react";
import type { DetailPageBlock } from "../data/systemPrompt";

interface DynamicDetailBlockProps {
  images: string[];
  detailBlocks: DetailPageBlock[];
  onBlockChange: (blockId: number, newText: string) => void;
}

export default function DynamicDetailBlock({ 
  images, 
  detailBlocks, 
  onBlockChange 
}: DynamicDetailBlockProps) {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  // Determine the text block logically associated with the selected image index.
  const textBlocks = detailBlocks.filter(b => b.type.includes('text'));
  const currentTextBlock = textBlocks[selectedImgIdx % textBlocks.length];

  // Parse Title and Body from the associated block content
  const parseBlockContent = (content: string) => {
    const lines = content.split('\n');
    const titleLine = lines.find(l => l.trim().startsWith('###') || l.trim().startsWith('##')) || '';
    const bodyLines = lines.filter(l => l !== titleLine).join('\n').trim();
    
    return {
      title: titleLine.replace(/^###\s*|^##\s*/, '').trim(),
      body: bodyLines,
      isH2: titleLine.trim().startsWith('## ') && !titleLine.trim().startsWith('###')
    };
  };

  const { title, body, isH2 } = parseBlockContent(currentTextBlock?.text_content || "");

  const handleTitleChange = (newTitle: string) => {
    if (!currentTextBlock) return;
    const prefix = isH2 ? '##' : '###';
    const updatedContent = `${prefix} ${newTitle}\n${body}`;
    onBlockChange(currentTextBlock.block_id, updatedContent);
  };

  const handleBodyChange = (newBody: string) => {
    if (!currentTextBlock) return;
    const prefix = isH2 ? '##' : '###';
    const updatedContent = `${prefix} ${title}\n${newBody}`;
    onBlockChange(currentTextBlock.block_id, updatedContent);
  };

  /* ========================================================================= */
  /* CSS CROP & ALIGNMENT SIMULATOR ENGINE (잘라내기 & 센터링 물리 구현) */
  /* ========================================================================= */
  // 이 헬퍼는 여백을 단순 마스킹하지 않고, 텍스트가 위치한 빈 공간을 물리적으로 크롭하여(overflow-hidden) 
  // 실제 베개/여성 단독 인물 영역만 프레임의 완벽한 상하좌우 기하학적 정중앙에 선명하게 렌더링합니다.
  const renderCroppedCardImage = (idx: number, imgUrl: string) => {
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
      </>
    );

    switch (idx) {
      case 1:
        // Index 1 (Image #2) - 잠자는 여성 (상단 28% 텍스트, 하단 34% 텍스트 잔상 위치)
        // 상하 텍스트 여백을 완전히 잘라내고(Clip Out), 남은 여성 수면 이미지 컷만 화면 한가운데 정배열합니다.
        return (
          <div className="w-full h-full min-h-[290px] relative overflow-hidden flex items-center justify-center rounded-md bg-white shadow-sm border border-outline-variant/30">
            <div className="absolute w-full h-[180%] overflow-hidden flex items-center justify-center">
              <img 
                src={imgUrl} 
                alt="Product Card" 
                className="w-full h-full object-cover scale-[1.3] translate-y-[-1%]"
                style={{ imageRendering: 'auto' }}
              />
            </div>
            {maskOverlays}
          </div>
        );

      case 4:
        // Index 4 (Image #5) - 5분할 경추 베개 설계도 (상단 52%에 대형 텍스트 위치)
        // 윗부분 52% 여백을 완전히 잘라 버리고, 아래쪽에 치우쳐 있던 도면 자체를 160% 줌인하여 정중앙으로 번쩍 끌어올립니다.
        return (
          <div className="w-full h-full min-h-[290px] relative overflow-hidden flex items-center justify-center rounded-md bg-white shadow-sm border border-outline-variant/30 p-2">
            <div className="absolute w-[100%] h-[160%] top-[4%] overflow-hidden flex items-center justify-center">
              <img 
                src={imgUrl} 
                alt="Product Card" 
                className="w-full h-full object-contain scale-[1.7] translate-y-[20%]"
                style={{ imageRendering: 'auto' }}
              />
            </div>
            {maskOverlays}
          </div>
        );

      case 5:
        // Index 5 (Image #6) - 포근하게 자고 있는 밀착 컷 (상단 56%에 큰 텍스트 위치)
        // 텍스트가 있던 상단 56%를 완전히 날려버리고, 나머지 인물 이미지를 scale-[1.3] 확대하여 화면 정가운데 웅장하게 밀착시킵니다.
        return (
          <div className="w-full h-full min-h-[290px] relative overflow-hidden flex items-center justify-center rounded-md bg-white shadow-sm border border-outline-variant/30">
            <div className="absolute w-full h-[160%] bottom-0 overflow-hidden flex items-center justify-center">
              <img 
                src={imgUrl} 
                alt="Product Card" 
                className="w-full h-full object-cover scale-[1.3] translate-y-[10%]"
                style={{ imageRendering: 'auto' }}
              />
            </div>
            {maskOverlays}
          </div>
        );

      default:
        // 기타 디폴트 제품 컷 (기존 여백이 고르고 깔끔한 경우 - 선명도 손상 없는 최적 배율 센터링)
        return (
          <div className="w-full h-full min-h-[290px] relative overflow-hidden flex items-center justify-center rounded-md bg-white shadow-sm border border-outline-variant/30 p-3">
            <img 
              src={imgUrl} 
              alt="Product Card" 
              className="max-w-full max-h-[270px] object-contain mx-auto my-auto object-center scale-[1.15]"
              style={{ imageRendering: 'auto' }}
            />
            {maskOverlays}
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-fade-in">
      
      {/* Control panel & Image tab selector */}
      <div className="flex flex-col gap-4 bg-surface-container-low p-5 rounded-xl border border-outline-variant/60">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-outline-variant/30 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="text-primary shrink-0" size={20} />
            <div>
              <h4 className="font-label-bold text-label-bold text-on-surface">AI 실시간 반응형 카드 에디터</h4>
              <p className="text-[11px] text-on-surface-variant">아래 카드의 제목과 설명 글씨를 수정하면 상세페이지 전체 정보 모델에 즉각 연동됩니다.</p>
            </div>
          </div>
        </div>

        {/* Bottom: Uploaded Image Thumbnails selector */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase shrink-0">대상 이미지:</span>
          <div className="flex gap-2">
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImgIdx(idx)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0
                  ${selectedImgIdx === idx ? 'border-primary shadow' : 'border-outline-variant hover:border-primary/50'}`}
              >
                <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 bg-black/60 text-white font-mono text-[9px] px-1 rounded-tl">
                  #{idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas Area: Responsive Card View only */}
      <div className="w-full rounded-xl overflow-hidden border border-outline-variant shadow bg-[#f8f9fa]">
        <div className="w-full flex flex-col md:grid md:grid-cols-12 gap-0">
          
          {/* Left Image Box: Tiny border padding, image fills maximum space containing original quality */}
          <div className="col-span-5 p-2.5 bg-surface-container flex items-center justify-center border-b md:border-b-0 md:border-r border-outline-variant/40 shrink-0 min-h-[350px]">
            <div className="w-full h-full min-h-[330px] rounded-lg overflow-hidden border border-outline-variant shadow-sm bg-white flex items-center justify-center relative p-1.5">
              
              {/* 물리적 크롭(잘라내기) 및 상하좌우 자동 정밀 센터링 렌더러 호출 */}
              {renderCroppedCardImage(selectedImgIdx, images[selectedImgIdx])}

              <div className="absolute bottom-3 left-3 bg-primary text-on-primary text-[9px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 z-10">
                <Sparkles size={10} className="animate-spin" />
                AI Cropped Center
              </div>
            </div>
          </div>

          {/* Right: Semantic Structured Text content details */}
          <div className="col-span-7 p-6 flex flex-col gap-4 bg-white justify-center">
            
            <div className="border-b border-outline-variant/40 pb-3 mb-1 flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1.5">
                <Layers size={18} className="text-primary" />
                SEO 구조화 텍스트 리스트
              </h3>
              <span className="text-[10px] bg-secondary-container text-on-secondary px-2.5 py-1 rounded-full font-bold uppercase">
                Image #{selectedImgIdx + 1}
              </span>
            </div>

            {/* Title Input (Editable) */}
            <div className="group/item border-l-2 border-primary pl-4 py-1.5 relative transition-all hover:border-primary-container">
              <span className="text-[9px] font-bold text-primary block uppercase tracking-wider mb-1">타이틀 제목</span>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="font-headline-sm text-primary text-left leading-relaxed w-full bg-surface-container-low px-2 py-1 rounded border border-outline-variant focus:outline-none focus:border-primary"
              />
            </div>

            {/* Description Input (Editable) */}
            <div className="group/item border-l-2 border-outline-variant pl-4 py-1.5 relative transition-all hover:border-primary-container">
              <span className="text-[9px] font-bold text-on-surface-variant block uppercase tracking-wider mb-1">본문 설명</span>
              <textarea
                value={body}
                onChange={(e) => handleBodyChange(e.target.value)}
                className="font-body-md text-on-surface-variant text-left leading-relaxed w-full bg-surface-container-low px-2 py-1 rounded border border-outline-variant focus:outline-none focus:border-primary resize-y min-h-[90px]"
              />
            </div>

            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/80 mt-1 bg-yellow-50 border border-yellow-100 p-2.5 rounded-lg">
              <AlertCircle size={12} className="text-yellow-600 shrink-0" />
              <span>글자를 수정하면 하단 스마트스토어 상세페이지 블록에 실시간 반영됩니다.</span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
