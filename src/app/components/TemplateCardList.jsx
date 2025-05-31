import TemplateCard from "../components/TemplateCard";
import add from "@/app/assets/add.png";
import letter from "@/app/assets/contract.png";
import proposal from "@/app/assets/proposal.png";
import sftpro from "@/app/assets/sftpro.png";
import CV from "@/app/assets/cover-letter.png";
import resume from "@/app/assets/resume.png";
const templates = [
  {
    id: "blank",
    title: "Blank Document",
    image: add,
  },
  {
    id: "business-letter",
    title: "Business Letter",
    image: letter,
  },
  {
    id: "project-proposal",
    title: "Project Proposal",
    image: proposal,
  },
  {
    id: "software-proposal",
    title: "Software Proposal",
    image: sftpro,
  },
  {
    id: "resume",
    title: "Resume",
    image: resume,
  },
  {
    id: "cover-letter",
    title: "Cover Letter",
    image: CV,
  },
];

export default function TemplateCardList() {
  return (
    <div className="p-4 bg-[#f1f1f1f1]">
      <h2 className="text-xl font-semibold mb-4">Start a new document</h2>
      <div className="relative">
        <div className="flex justify-between items-center gap-4 overflow-x-auto no-scrollbar px-6">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
}
