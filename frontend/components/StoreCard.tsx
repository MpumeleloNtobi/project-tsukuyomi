import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { useRouter } from 'next/navigation';
import store from "@/public/store.png"
interface StoreCardProps {
    id: string,
  name: string,
  description: string
}

export default function StoreCard({ id, name, description }: StoreCardProps) {
  return (
    <div
      className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border`}
    >
    <a href={`/stores/${id}`}>
    <div className="relative h-48 overflow-hidden flex justify-center items-center">
    <Image
        src={store}
        alt={name}
        width={200}
        height={200}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
</div>


      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-full group-hover:bg-purple-100 transition-colors">
            <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-purple-600" />
          </div>
        </div>
      </div>
      </a>
    </div>
  )
}
