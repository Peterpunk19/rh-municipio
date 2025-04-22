export const getDays = async () => {
  try {
    const days = await prisma.day.findMany({
      where: {
        active: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    return days;
  } catch (error) {
    return error;
  }
};

export const getHours = async () => {
  try {
    const hours = await prisma.hour.findMany({
      where: {
        active: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    return hours;
  } catch (error) {
    return error;
  }
};
