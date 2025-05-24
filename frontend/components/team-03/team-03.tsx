import { Button } from "@/components/ui/button";
import { DribbbleIcon, TwitchIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const teamMembers = [
  {
    name: "Mpumelelo",
    title: "Backend",
    bio: "BSc in Computer Science Student at Wits | Aspiring Software Engineer",
    imageUrl:
      "https://sdprojectimages2.blob.core.windows.net/product-images/mpumelelo.jpg",
  },
  {
    name: "Muaaz Bayat",
    title: "Project Lead & Design",
    bio: "Full Stack Software Engineer at Helm. | Co-founder at Sebenzo",
    imageUrl:
      "https://sdprojectimages2.blob.core.windows.net/product-images/muaaz.jpeg",
  },
  {
    name: "Suhail Seedat",
    title: "Frontend & Admin",
    bio: "BSc Computer science at Wits | Exploring a future in tech.",
    imageUrl:
      "https://sdprojectimages2.blob.core.windows.net/product-images/suhail.jpg",
  },
  {
    name: "Yanga",
    title: "Frontend",
    bio: "Computer Science student with a strong interest in software development & system architecture.",
    imageUrl:
      "https://sdprojectimages2.blob.core.windows.net/product-images/yanga.jpg",
  },
  {
    name: "Bongani",
    title: "Backend",
    bio: "BSc Computer science at Wits | Aspiring ML Engineer",
    imageUrl:
      "https://sdprojectimages2.blob.core.windows.net/product-images/bongani.jpeg",
  },
  {
    name: "Phuteho",
    title: "Frontend & Database",
    bio: "BSc in Computer Science Student at Wits | Aspiring Software Engineer",
    imageUrl:
      "https://sdprojectimages2.blob.core.windows.net/product-images/phuteho.jpg",
  },
];

const Team03Page = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-center py-8 sm:py-16 px-6 lg:px-8 max-w-screen-xl mx-auto gap-14">
      <div className="sm:max-w-sm lg:max-w-xs">
        <b className="text-muted-foreground font-semibold">Our team</b>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
         Group 35
        </h2>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12">
        {teamMembers.map((member) => (
          <div key={member.name} className="flex items-start md:flex-col gap-4">
            <Image
              src={member.imageUrl}
              alt={member.name}
              className="shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover bg-secondary"
              width={120}
              height={120}
            />
            <div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-muted-foreground text-sm">{member.title}</p>
              <p className="mt-2">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team03Page;
