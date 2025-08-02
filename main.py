from lessons.beginner import AT_RESTAURANT
from lessons.instructor import LessonInstructor, LessonMode

if __name__ == "__main__":
    instructor = LessonInstructor(config=AT_RESTAURANT, mode=LessonMode.TEXT)
    instructor.start()
