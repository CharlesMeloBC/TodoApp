interface TaskFilterProps {
    FilterProps: (status: string) => void;
}

export default function TaskFilter({ FilterProps }: TaskFilterProps) {
    const HandleFilterProps = (e: React.ChangeEvent<HTMLSelectElement>) => {
        FilterProps(e.target.value);
    }
    return (
        <select className="bg-secondary text-sm font-semibold rounded pl-2 pr-2 shadow-xs hover:bg-secondary/80" id="tasks" onChange={HandleFilterProps}>
            <option value="">Todas</option>
            <option value="Completed">Completas</option>
            <option value="Pending">Pendentes</option>
        </select>
    )
}