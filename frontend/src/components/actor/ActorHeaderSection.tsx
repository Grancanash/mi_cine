interface Props {
    title: string;
}
function HeaderTitle({title}: Props) {
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <h1 className="text-3xl font-bold md:px-5">{title}</h1>
            </div>
        </div>
    );
}

export default HeaderTitle;