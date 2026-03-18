'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDate, getImageUrl, truncate } from '@/lib/utils';
import { useLocale } from 'next-intl';

export default function Card({ item, href, locale: propLocale }) {
  const hookLocale = useLocale();
  const locale = propLocale || hookLocale;

  const title = item?.translations?.[locale]?.title || item?.translations?.vi?.title || item?.title || '';
  const excerpt = item?.translations?.[locale]?.excerpt || item?.translations?.[locale]?.summary || item?.translations?.vi?.excerpt || item?.excerpt || '';
  const coverImage = item?.cover_image || item?.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="card group"
    >
      <Link href={href}>
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {coverImage ? (
            <Image
              src={getImageUrl(coverImage)}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <span className="text-4xl text-primary/30 font-bold" style={{ fontFamily: 'Noto Sans JP' }}>日</span>
            </div>
          )}
          {item?.category && (
            <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
              {item.category}
            </span>
          )}
        </div>
        <div className="p-4">
          {item?.published_at && (
            <p className="text-xs text-gray-400 mb-2">{formatDate(item.published_at, locale)}</p>
          )}
          <h3 className="font-semibold text-japanese-dark text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          {excerpt && (
            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
              {truncate(excerpt, 120)}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
