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
  /* 원본 상품 이미지 렌더러 (텍스트 제거/잘라내기 없이 그대로 로드) */
  /* ========================================================================= */
  const renderCroppedCardImage = (_idx: number, imgUrl: string) => {
    return (
      <div className="w-full h-full min-h-[290px] relative overflow-hidden flex items-center justify-center rounded-md bg-white shadow-sm border border-outline-variant/30 p-2">
        <img 
          src={imgUrl} 
          alt="Product Factual" 
          className="max-w-full max-h-[275px] object-contain mx-auto my-auto object-center"
          style={{ imageRendering: 'auto' }}
        />
      </div>
    );
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
                <Sparkles size={10} />
                AI Text Extracted
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
