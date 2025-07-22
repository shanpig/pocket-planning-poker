import GithubIcon from "@/assets/github-logo.webp";
import Image from "next/image";

const GithubLink = () => {
  return (
    <div
      className="fixed top-0 right-0 bg-black w-20 h-20 z-50 hover:scale-105"
      style={{
        clipPath: "polygon(100% 0, 100% 100%, 0 0)",
      }}
    >
      <a
        href="https://github.com/shanpig/pocket-planning-poker"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-1 right-1 rotate-45 w-1/2 h-1/2"
      >
        <Image src={GithubIcon} alt="Github" fill />
      </a>
    </div>
  );
};

export default GithubLink;
