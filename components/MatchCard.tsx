import { UserProfile } from "@/app/profile/page";
import { calculateAge } from "@/lib/helpers/calculate-age";
import Image from "next/image";

export default function MatchCard({ user }: { user: UserProfile }) {
  const avatarUrl =
    user.avatar_url ||
    'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(user.full_name) +
      '&size=400&background=random';

  // Custom loader to directly use the provided src as the image URL
  const avatarLoader = ({ src }: { src: string }) => src;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="card-swipe aspect-[3/4] overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={avatarUrl}
            alt={user.full_name}
            fill
            loader={avatarLoader}
            className="object-cover transition-opacity duration-300"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {user.full_name}, {calculateAge(user.birthdate)}
                </h2>
                <p className="text-sm opacity-90 mb-2">@{user.username}</p>
                <p className="text-sm leading-relaxed">{user.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
