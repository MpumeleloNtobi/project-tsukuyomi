import { ArrowUpRight } from "lucide-react";


interface StoreCardProps {
  id: string;
  name: string;
  description: string;
}

export default function StoreCard({ id, name, description }: StoreCardProps) {
  return (
    <div
      className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border
                          dark:bg-black dark:border-gray-700`} // Added dark mode classes here
    >
      <a href={`/stores/${id}`}>
        <div
          className="relative h-48 overflow-hidden flex justify-center items-center"
          style={{
            background: 'linear-gradient(to bottom, hotpink, black)', // Replaced Image with gradient
          }}
        >
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white"> {/* Adjusted text color for dark mode */}
                {name}
              </h3>
              <p className="text-gray-500 text-sm dark:text-gray-400"> {/* Adjusted text color for dark mode */}
                {description}
              </p>
            </div>
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-purple-100 transition-colors
                                  dark:bg-gray-800 dark:group-hover:bg-purple-900"> {/* Adjusted background color for dark mode */}
              <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-purple-600
                                               dark:text-gray-400 dark:group-hover:text-purple-400" /> {/* Adjusted icon color for dark mode */}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}