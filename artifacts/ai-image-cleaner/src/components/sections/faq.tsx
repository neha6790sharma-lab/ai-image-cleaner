const FAQ_ITEMS = [
  {
    question: 'Is cleaner. really free?',
    answer:
      'Yes. All ten tools are free to use, with no sign-up, no trial window, and no watermark printed on your downloads. We do not ask for a credit card and there is no paid tier hiding behind the basics — if a tool can do the job, you can use it.',
  },
  {
    question: 'Do my images get uploaded to a server?',
    answer:
      'No. Photos you open in cleaner. stay in memory in your browser tab. The only exception is the two AI-driven tools: Remove Object and Remove Background send your image to a private local service that performs the processing step in memory, returns the result, and keeps nothing. There is no cloud library, no history, and no leftover copy once you close the tab.',
  },
  {
    question: 'Which file formats can I work with?',
    answer:
      'You can upload JPG, PNG, and WEBP images up to 15 MB. Depending on the tool you can export back to JPG, PNG, or WEBP — for example converting a PNG screenshot to a smaller JPG, or exporting a cropped photo as a lossless PNG.',
  },
  {
    question: 'How does Remove Object work?',
    answer:
      'You paint over whatever you want to disappear — a photobomber, a cable, a blemish — and adjust the brush size as you go. When you confirm, the local service fills the painted area using the surrounding pixels, so the spot is replaced with matching texture instead of a blank hole. You can preview the result before you download.',
  },
  {
    question: 'How does Remove Background work?',
    answer:
      'A free local AI model detects the main subject of your photo and cuts it out, returning a transparent PNG. The first time you use it, the model downloads once to the serving machine — this can take a few seconds. After that, you can also switch to a white background, which works well for passport-style photos.',
  },
  {
    question: 'Will these tools work on my phone?',
    answer:
      'Yes. Everything is designed to work on touch screens and small viewports, and the layout adapts as you resize. Cropping, painting the object mask, and all the sliders respond to touch input, so you can edit a photo fully on a phone or tablet without a desktop machine.',
  },
  {
    question: 'Is there a limit on how many images I can process?',
    answer:
      'The in-browser tools — crop, convert, rotate, passport size, adjust, compress, watermark, and privacy cleanup — have no daily cap. The two local-service tools (Remove Object and Remove Background) apply a short per-minute rate limit to keep the shared service responsive, but there is no charge and no account involved.',
  },
  {
    question: 'Why does cleaner. not store my files?',
    answer:
      'Because storing files is exactly the problem most image tools introduce. Keeping your photos in memory means there is nothing to breach, nothing to delete later, and nothing a data broker can buy. Privacy is not a mode you toggle on — it is simply how the tool is built.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-anchor border-t border-[#252f33] bg-[#121719]/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto mb-10 max-w-3xl">
          <div className="mb-3 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
            <span className="h-px w-7 bg-[#62e4dc]" /> Questions
          </div>
          <h2 className="text-center text-3xl font-bold tracking-[-.05em] text-[#f5f1e8] sm:text-4xl">
            Frequently asked <span className="text-[#f0bd5b]">questions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-[#9eabad]">
            The short versions of the questions people ask most, answered honestly. If something is still unclear, every tool
            on this page is free to try — the quickest way to understand how it works is to load an image.
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-[#293337] bg-[#151b1e]/70 open:border-[#f0bd5b]/30"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-semibold leading-6 text-[#f5f1e8] [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span className="shrink-0 text-[#f0bd5b] transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="border-t border-[#293337]/80 px-5 pb-5 pt-4 text-sm leading-6 text-[#8f9da0]">{item.answer}</p>
            </details>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-[#647477]">
          Still curious? Head down to the tool and try any of the ten editors — no account needed, nothing leaves your browser.
        </p>
      </div>
    </section>
  );
}