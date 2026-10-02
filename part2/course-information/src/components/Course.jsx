const Header = ({ course }) => <h1>{course}</h1>;
const Content = ({ parts }) => {
    return (
        <div>
            {
                parts.map((p, index) =>
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