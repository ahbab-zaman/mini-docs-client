import Image from "next/image";

export default function TemplateCard({ template }) {
  return (
    <div className="min-w-[160px] flex-shrink-0 cursor-pointer transition ">
      <div className="w-full aspect-[3/4] bg-white rounded-md shadow p-2 flex items-center justify-center overflow-hidden hover:border-[1px] hover:border-blue-400 hover:transition-all hover:duration-500">
        <Image src={template?.image} width={70} height={70} alt="Add Icon" />
      </div>
      <p className="mt-2 text-center font-semibold">{template.title}</p>
    </div>
  );
}
