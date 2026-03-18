'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { testAPI } from '@/lib/api';
import { getTranslation } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const FALLBACK_TEST = {
  id: 1, slug: 'mini-test-n5-grammar', level: 'N5', time_limit: 30,
  translations: {
    vi: { title: 'Mini Test N5 - Ngữ Pháp', description: 'Bài kiểm tra ngữ pháp N5 gồm 20 câu hỏi trắc nghiệm. Mỗi câu chỉ có một đáp án đúng.' }
  },
  questions: [
    { id: 1, text: 'これは _____ ほんです。(This is _____ book.)', options: ['わたしの', 'わたし', 'わたしに', 'わたしを'], correct: 0 },
    { id: 2, text: 'まいにち にほんごを _____ います。(I study Japanese every day.)', options: ['たべて', 'のんで', 'べんきょうして', 'かいて'], correct: 2 },
    { id: 3, text: '_____ は なんじですか。(What time is it now?)', options: ['どこ', 'いつ', 'いま', 'だれ'], correct: 2 },
    { id: 4, text: 'きょうは _____ いいてんきですね。(It is good weather today.)', options: ['とても', 'あまり', 'ちょっと', 'もっと'], correct: 0 },
    { id: 5, text: 'すみません、えきは _____ ですか。(Excuse me, where is the station?)', options: ['なに', 'だれ', 'どこ', 'いつ'], correct: 2 },
    { id: 6, text: 'わたしは がくせい _____。(I am a student.)', options: ['は', 'が', 'を', 'です'], correct: 3 },
    { id: 7, text: 'コーヒーを _____ のみますか。(Would you like to drink coffee?)', options: ['なん', 'いくら', 'どんな', 'どうぞ'], correct: 3 },
    { id: 8, text: 'きのう えいがを _____ ました。(I watched a movie yesterday.)', options: ['みます', 'みて', 'み', 'みる'], correct: 2 },
    { id: 9, text: 'にほんご_____ はなせますか。(Can you speak Japanese?)', options: ['に', 'を', 'が', 'は'], correct: 2 },
    { id: 10, text: 'わたしの かばんは _____ です。(My bag is big.)', options: ['おおきい', 'おおきく', 'おおきな', 'おおきに'], correct: 0 },
  ]
};

function Timer({ seconds, onExpire }) {
  const t = useTranslations('exams');
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isWarning = remaining < 120;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg ${isWarning ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
      ⏱ {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
}

export default function TestPage() {
  const { slug } = useParams();
  const locale = useLocale();
  const t = useTranslations('exams');
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);

  const localePath = (href) => `/${locale}${href}`;

  useEffect(() => {
    testAPI.getOne(slug)
      .then(res => setTest(res.data?.test || res.data))
      .catch(() => setTest(FALLBACK_TEST))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner fullPage />;

  const testData = test || FALLBACK_TEST;
  const title = getTranslation(testData, locale, 'title');
  const description = getTranslation(testData, locale, 'description');
  const questions = testData.questions || [];

  const handleAnswer = (qId, optIdx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = async () => {
    const correct = questions.filter(q => answers[q.id] === q.correct).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 60;
    setResult({ correct, total: questions.length, score, passed });
    setSubmitted(true);
    try {
      await testAPI.submit(testData.id, { answers, score });
    } catch (e) {
      // offline fallback
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-japanese-gray flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-4">🖊</div>
          <h1 className="text-2xl font-bold text-japanese-dark mb-2">{title}</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-4">
            <span>📊 {testData.level}</span>
            <span>❓ {questions.length} câu</span>
            <span>⏱ {testData.time_limit} phút</span>
          </div>
          {description && <p className="text-gray-600 text-sm leading-relaxed mb-6">{description}</p>}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700 mb-6">
            ⚠️ Sau khi bắt đầu, đồng hồ đếm ngược sẽ chạy. Hãy hoàn thành trong thời gian quy định.
          </div>
          <button onClick={() => setStarted(true)} className="btn-primary w-full text-base py-3">
            Bắt Đầu Làm Bài
          </button>
          <Link href={localePath('/exams')} className="block mt-3 text-sm text-gray-400 hover:text-gray-600">
            ← Quay Lại
          </Link>
        </motion.div>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-japanese-gray flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {result.passed ? '🎉' : '😔'}
            </div>
            <h2 className="text-2xl font-bold text-japanese-dark mb-2">
              {result.passed ? t('passed') + '!' : t('failed')}
            </h2>
            <div className="text-5xl font-bold text-primary my-4">{result.score}<span className="text-2xl text-gray-400">/100</span></div>
            <p className="text-gray-500">{t('correct')}: {result.correct}/{result.total}</p>
          </div>

          <div className="space-y-3 mb-6">
            {questions.map((q, i) => {
              const isCorrect = answers[q.id] === q.correct;
              return (
                <div key={q.id} className={`p-4 rounded-lg border text-sm ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="font-medium mb-2 text-japanese-dark">{i + 1}. {q.text}</div>
                  <div className="flex items-center gap-2">
                    <span className={isCorrect ? 'text-green-600' : 'text-red-500'}>
                      {isCorrect ? '✓' : '✗'} Câu trả lời: {q.options[answers[q.id] ?? -1] || 'Chưa trả lời'}
                    </span>
                    {!isCorrect && (
                      <span className="text-green-600 ml-2">| Đúng: {q.options[q.correct]}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setStarted(false); setSubmitted(false); setAnswers({}); setResult(null); setCurrentQ(0); }} className="btn-outline flex-1">
              Làm Lại
            </button>
            <Link href={localePath('/exams')} className="btn-primary flex-1 text-center">
              Xem Bài Thi Khác
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="min-h-screen bg-japanese-gray">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-japanese-dark text-sm">{title}</h1>
            <p className="text-xs text-gray-400">Câu {currentQ + 1} / {questions.length}</p>
          </div>
          <Timer seconds={testData.time_limit * 60} onExpire={handleSubmit} />
        </div>
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
              <div className="flex items-start gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {currentQ + 1}
                </span>
                <p className="text-japanese-dark font-medium leading-relaxed" style={{ fontFamily: 'Noto Sans JP' }}>
                  {q?.text}
                </p>
              </div>

              <div className="space-y-3">
                {q?.options?.map((opt, idx) => {
                  const selected = answers[q.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(q.id, idx)}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                        selected
                          ? 'border-primary bg-primary/5 text-primary font-medium'
                          : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${selected ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                          {['A', 'B', 'C', 'D'][idx]}
                        </span>
                        <span style={{ fontFamily: 'Noto Sans JP' }}>{opt}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
                className="btn-outline py-2 disabled:opacity-40"
              >
                ← Câu Trước
              </button>

              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                      i === currentQ ? 'bg-primary text-white' :
                      answers[questions[i]?.id] !== undefined ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))}
                  className="btn-primary py-2"
                >
                  Câu Tiếp →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="btn-primary py-2 bg-green-600 hover:bg-green-700"
                >
                  {t('submit')} ✓
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
