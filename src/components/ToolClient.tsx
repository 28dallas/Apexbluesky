'use client';

import ToolInterface from './ToolInterface';
import * as t from '@/lib/tools';
import ImageCropperTool from './tools/ImageCropperTool';
import ColorPickerTool from './tools/ColorPickerTool';
import WatermarkTool from './tools/WatermarkTool';
import MpesaStatementTool from './tools/MpesaStatementTool';
import EssayGeneratorTool from './tools/EssayGeneratorTool';
import BackgroundRemoverTool from './tools/BackgroundRemoverTool';
import MergePdfTool from './tools/MergePdfTool';

const actionMap: Record<string, any> = {
    "mergePDFs": t.mergePDFs,
    "splitPDF": t.splitPDF,
    "pdfToWord": t.pdfToWord,
    "compressPDF": t.compressPDF,
    "imageCompressor": t.imageCompressor,
    "imageResizer": t.imageResizer,
    "convertJPGtoPNG": t.convertJPGtoPNG,
    "essayGenerator": t.essayGenerator,
    "paraphraseText": t.paraphraseText,
    "grammarChecker": t.grammarChecker,
    "generateBlogTitles": t.generateBlogTitles,
    "generateBlogPost": t.generateBlogPost,
    "generateProductDesc": t.generateProductDesc,
    "draftEmail": t.draftEmail,
    "generateStory": t.generateStory,
    "generateInstaCaption": t.generateInstaCaption,
    "generateYTDescription": t.generateYTDescription,
    "generateLinkedInPost": t.generateLinkedInPost,
    "generateTweet": t.generateTweet,
    "generateSEOKeywords": t.generateSEOKeywords,
    "generateMetaTagsAI": t.generateMetaTagsAI,
    "generateBlogOutline": t.generateBlogOutline,
    "generateBusinessName": t.generateBusinessName,
    "generateValueProp": t.generateValueProp,
    "generateImagePrompt": t.generateImagePrompt,
    "generateCoverLetter": t.generateCoverLetter,
    "generateResumeSummary": t.generateResumeSummary,
    "reviewCode": t.reviewCode,
    "generateRegex": t.generateRegex,
    "generateFlashcards": t.generateFlashcards,
    "generateSlogan": t.generateSlogan,
    "generateAltText": t.generateAltText,
    "generateSQL": t.generateSQL,
    "generateStudyPlan": t.generateStudyPlan,
    "ytTitleGenerator": t.ytTitleGenerator,
    "generateYouTubeTags": t.generateYouTubeTags,
    "thumbnailDownloader": t.thumbnailDownloader,
    "keywordDensity": t.keywordDensity,
    "metaTagGenerator": t.metaTagGenerator,
    "sitemapGenerator": t.sitemapGenerator,
    "formatJSON": t.formatJSON,
    "cssMinifier": t.cssMinifier,
    "htmlBeautifier": t.htmlBeautifier,
    "ageCalculator": t.ageCalculator,
    "loanCalculator": t.loanCalculator,
    "calculateBMI": t.calculateBMI,
    "mp4ToMp3": t.mp4ToMp3,
    "pdfToJpg": t.pdfToJpg,
    "pngToWebP": t.pngToWebP,
    "generateHashtags": t.generateHashtags,
    "bioGenerator": t.bioGenerator,
    "tiktokCaption": t.tiktokCaption,
    "calculateGPA": t.calculateGPA,
    "citationGenerator": t.citationGenerator,
    "studyPlanner": t.studyPlanner,
    "mpesaToPDF": t.mpesaToPDF,
    "logoGenerator": t.logoGenerator,
    "generatePassword": t.generatePassword,
    "generateQRCode": t.generateQRCode,
    "generateUUID": t.generateUUID,
    "wordCount": t.wordCount,
    "colorPicker": t.colorPicker,
    "pngToJpg": t.pngToJpg,
    "cropImage": t.cropImage,
    "addWatermark": t.addWatermark,
    "base64EncodeDecode": t.base64EncodeDecode,
    "urlEncodeDecode": t.urlEncodeDecode
};

import { useState, useEffect } from 'react';
import LimitModal from './LimitModal';
import TikTokPromoModal from './TikTokPromoModal';

const TIKTOK_STORAGE_KEY = 'apexbs_tiktok_dismissed';

export default function ToolClient({ tool, id }: { tool: any, id: string }) {
    const action = actionMap[tool.action];
    const [limitReason, setLimitReason] = useState<string | null>(null);
    const [showTikTok, setShowTikTok] = useState(false);
    const [tikTokDone, setTikTokDone] = useState(false);

    // Show the TikTok modal once per browser session
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const dismissed = localStorage.getItem(TIKTOK_STORAGE_KEY);
            if (!dismissed) setShowTikTok(true);
            else setTikTokDone(true);
        }
    }, []);

    const handleTikTokContinue = () => {
        setTikTokDone(true);
        setShowTikTok(false);
    };

    if (id === 'image-cropper') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><ImageCropperTool tool={tool} id={id} /></>;
    if (id === 'color-picker') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><ColorPickerTool tool={tool} id={id} /></>;
    if (id === 'watermark-maker') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><WatermarkTool tool={tool} id={id} /></>;
    if (id === 'mpesa-statement') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><MpesaStatementTool tool={tool} id={id} /></>;
    if (id === 'essay-generator') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><EssayGeneratorTool tool={tool} id={id} /></>;
    if (id === 'background-remover') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><BackgroundRemoverTool tool={tool} id={id} /></>;
    if (id === 'merge-pdf') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><MergePdfTool tool={tool} id={id} /></>;

    const fileActions = new Set([
        'mergePDFs',
        'splitPDF',
        'pdfToWord',
        'compressPDF',
        'pdfToJpg',
        'imageCompressor',
        'backgroundRemover',
        'imageResizer',
        'convertJPGtoPNG',
        'pngToWebP',
        'pngToJpg',
        'mp4ToMp3',
    ]);

    const inputType = tool.action === 'mergePDFs'
        ? 'files'
        : fileActions.has(tool.action)
            ? 'file'
            : 'text';

    const accept = (() => {
        if (inputType === 'text') return '*/*';
        switch (tool.action) {
            case 'mergePDFs':
            case 'splitPDF':
            case 'pdfToWord':
            case 'compressPDF':
            case 'pdfToJpg':
                return '.pdf,application/pdf';
            case 'mp4ToMp3':
                return 'video/mp4,video/*';
            case 'convertJPGtoPNG':
                return 'image/jpeg,image/jpg';
            case 'pngToWebP':
            case 'pngToJpg':
                return 'image/png';
            case 'backgroundRemover':
            case 'imageCompressor':
            case 'imageResizer':
                return 'image/*';
            default:
                return '*/*';
        }
    })();

    return (
        <>
            <TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} />
            <ToolInterface
                {...tool}
                id={id}
                onAction={action}
                inputType={inputType}
                accept={accept}
                onLimitReached={setLimitReason}
            />
            <LimitModal
                isOpen={!!limitReason}
                onClose={() => setLimitReason(null)}
                reason={limitReason || ''}
            />
        </>
    );
}
