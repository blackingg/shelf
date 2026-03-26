import Link from "next/link";
import { Book } from "../types/book";
import { FiBookmark, FiEdit, FiTrash } from "react-icons/fi";

export function BookCardListView(props: {
  book: Book;
  deleteFunct?: () => void;
}) {
  const { coverImage, title, author, id, slug } = props.book;
  return (
    <div className="grid grid-cols-10 gap-x-6 my-4 items-center">
      <div className="grid col-span-1 justify-center">
        <img src={coverImage} className="h-16 w-12 rounded-sm " />
      </div>
      <div className="grid col-span-7">
        <Link href={`/app/books/${slug}/`} className="text--xl font-bold">
          {title}
        </Link>
        <p>{author}</p>
      </div>
      <div className="grid col-span-2 grid-cols-3">
        <FiBookmark
          className="w-6 h-6 hover:fill-emerald-500"
          title="Add to Bookmarks"
        />
        <FiEdit
          className="w-6 h-6 hover:fill-amber-600"
          title="Edit Donation Details"
        />
        <FiTrash
          className="w-6 h-6 hover:bg-red-600 rounded-xs"
          title="Delete Donation"
          onClick={props.deleteFunct}
        />
      </div>
    </div>
  );
}
