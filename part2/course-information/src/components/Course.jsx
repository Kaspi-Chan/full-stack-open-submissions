const Header = ({ course }) => <h2>{course}</h2>;
const Content = ({ parts }) => {
    return (
        <div>
            {
                parts.map((p) =>
                    <Part name={p.name} exercises={p.exercises} key={p.id}  />
                )}
        </div>
    )
}

const Part = ({ name, exercises }) => <p>{name} {exercises}</p>;

const Total = ({ parts }) => {
    const total = parts.reduce((result, part) => result + part.exercises, 0)
    return (
        <p><b>total of {total} exercises</b></p>
    )
}

const Course = ({ course }) => {
    return (
        <>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )
}

export default Course;