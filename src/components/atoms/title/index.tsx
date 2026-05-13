export const Title = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="title__container">
            <h1 className="title__text"> {children} </h1>
        </div>
    );
}