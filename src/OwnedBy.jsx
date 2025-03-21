import avatar from "animal-avatar-generator";
export default function MeetYourHost({ name, email }) {
  let svg = avatar(name||"", { size: 60, blackout: false });
  return (
    <div class="flex flex-row space-x-3 mt-3 mb-3">
      <div
        className="object-cover w-12 h-12 mr-3 rounded-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div>
        <p
          class="font-display lg:text-lg md:text-lg sm:text-sm font-semibold text-black"
          itemprop="author"
        >
          Hosted and Owned by {name||""}
        </p>
        <div class="mb-3 prose prose-sm text-gray-400">
          <p>Super Host</p>
        </div>
      </div>
    </div>
  );
}
