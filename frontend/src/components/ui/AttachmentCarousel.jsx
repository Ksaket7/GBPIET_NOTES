import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const getAttachmentImages = (item) => {
  const images = Array.isArray(item?.images) ? item.images.filter(Boolean) : [];
  if (images.length) return images;
  return item?.imageUrl ? [item.imageUrl] : [];
};

export default function AttachmentCarousel({
  item,
  images: providedImages,
  label = "Attachment image",
  className = "mt-4",
}) {
  const images = providedImages?.length ? providedImages : getAttachmentImages(item);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) return null;

  const hasMultipleImages = images.length > 1;

  const goPrevious = () => {
    setActiveIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const goNext = () => {
    setActiveIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  return (
    <div className={`${className} overflow-hidden rounded-2xl border border-slate-900 bg-black pt-3`}>
      <div className="relative bg-black">
        <img
          src={images[activeIndex]}
          alt={`${label} ${activeIndex + 1}`}
          className="max-h-[520px] min-h-64 w-full bg-black object-contain"
        />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={goPrevious}
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg shadow-slate-900/10 transition hover:bg-indigo-600 hover:text-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg shadow-slate-900/10 transition hover:bg-indigo-600 hover:text-white"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="flex items-center justify-center gap-2 bg-black px-4 py-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition ${
                activeIndex === index
                  ? "w-6 bg-indigo-600"
                  : "w-2 bg-slate-300 hover:bg-indigo-300"
              }`}
              aria-label={`Show image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
