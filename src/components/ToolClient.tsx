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
    "urlEncodeDecode": t.urlEncodeDecode,
    "followersAnalysis": t.followersAnalysis,
    "bulkActions": t.bulkActions,
    "dataExports": t.dataExports
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

    const creditCosts: Record<string, number> = {
        'essayGenerator': 2,
        'paraphraseText': 1,
        'pdfToWord': 3,
        'backgroundRemover': 3,
        'mpesaToPDF': 5,
        'splitPDF': 1,
        'mergePDFs': 3,
        'imageCropper': 1,
        'watermarkMaker': 2
    };

    if (id === 'image-cropper') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><ImageCropperTool tool={tool} id={id} credits={creditCosts['imageCropper']} /></>;
    if (id === 'color-picker') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><ColorPickerTool tool={tool} id={id} /></>;
    if (id === 'watermark-maker') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><WatermarkTool tool={tool} id={id} credits={creditCosts['watermarkMaker']} /></>;
    if (id === 'mpesa-statement') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><MpesaStatementTool tool={tool} id={id} credits={creditCosts['mpesaToPDF']} disclaimer="This is an unofficial statement. ApexBlueSky Tools is not affiliated with Safaricom M-Pesa. Use generated statements at your own discretion. Not for legal or bank verification use." /></>;
    if (id === 'essay-generator') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><EssayGeneratorTool tool={tool} id={id} credits={creditCosts['essayGenerator']} /></>;
    if (id === 'background-remover') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><BackgroundRemoverTool tool={tool} id={id} credits={creditCosts[tool.action]} /></>;
    if (id === 'merge-pdf') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><MergePdfTool tool={tool} id={id} credits={creditCosts['mergePDFs']} /></>;

    const fileActions = new Set([
        'mergePDFs',
        'pdfToWord',
        'compressPDF',
        'pdfToJpg',
        'imageCompressor',
        'backgroundRemover',
        'convertJPGtoPNG',
        'pngToWebP',
        'pngToJpg',
        'mp4ToMp3',
    ]);

    const formActions: Record<string, any[]> = {
        'splitPDF': [
            { id: 'file', label: 'Select PDF', type: 'file', accept: '.pdf' },
            { id: 'range', label: 'Page Range (e.g. 1, 3-5)', type: 'text', defaultValue: '1', placeholder: '1, 3-5' }
        ],
        'imageResizer': [
            { id: 'file', label: 'Select Image', type: 'file', accept: 'image/*' },
            { id: 'width', label: 'Width (px)', type: 'number', defaultValue: 800 },
            { id: 'height', label: 'Height (px)', type: 'number', placeholder: 'Optional' }
        ],
        'loanCalculator': [
            { id: 'principal', label: 'Principal Amount', type: 'number', defaultValue: 10000 },
            { id: 'rate', label: 'Interest Rate (%)', type: 'number', defaultValue: 5, step: 0.1 },
            { id: 'time', label: 'Time (Years)', type: 'number', defaultValue: 3 }
        ],
        'calculateBMI': [
            { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 70 },
            { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 170 }
        ],
        'ageCalculator': [
            { id: 'dob', label: 'Date of Birth', type: 'text', placeholder: 'YYYY-MM-DD' }
        ]
    };

    const aiActions = new Set([
        'essayGenerator', 'paraphraseText', 'grammarChecker', 'generateBlogTitles',
        'generateBlogPost', 'generateProductDesc', 'draftEmail', 'generateStory',
        'generateInstaCaption', 'generateYTDescription', 'generateLinkedInPost',
        'generateTweet', 'generateSEOKeywords', 'generateMetaTagsAI', 'generateBlogOutline',
        'generateBusinessName', 'generateValueProp', 'generateImagePrompt',
        'generateCoverLetter', 'generateResumeSummary', 'reviewCode',
        'generateRegex', 'generateFlashcards', 'generateSlogan', 'generateAltText',
        'generateSQL', 'generateStudyPlan'
    ]);

    const inputType = formActions[tool.action]
        ? 'form'
        : tool.action === 'mergePDFs'
            ? 'files'
            : fileActions.has(tool.action)
                ? 'file'
                : 'text';

    const accept = (() => {
        if (inputType === 'text' || inputType === 'form') return '*/*';
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
                fields={formActions[tool.action]}
                isAI={aiActions.has(tool.action)}
                credits={creditCosts[tool.action]}
                disclaimer={tool.action === 'mpesaToPDF' ? "This is an unofficial statement. ApexBlueSky Tools is not affiliated with Safaricom M-Pesa. Use generated statements at your own discretion. Not for legal or bank verification use." : undefined}
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
