import Link from "next/link";

interface BreadcrumbProps {
  pageName: string;
  subPageName?: string;
}


const Breadcrumb = ({ pageName, subPageName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
        {pageName} {subPageName && `/ ${subPageName}`}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          <li>
          <Link className={`font-medium ${!subPageName ? 'text-primary' : ''}`} href={`/${pageName.toLowerCase()}`}>
              {pageName}
            </Link>
          </li>
          {subPageName && (
            <li className="font-medium text-primary">/ {subPageName}</li>
          )}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;

