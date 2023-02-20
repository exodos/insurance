import * as ReactIcons from "react-icons/fa";
export const Icons = ({ rows }) => {
  const IconsComponent = ReactIcons[rows];
  return (
    <div>
      <IconsComponent
        className="mr-5 flex-shrink-0 h-6 w-6 text-lightBlue group-hover:text-deepBlue"
        aria-hidden="true"
      />
    </div>
  );
};
