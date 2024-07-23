// Definir los días festivos del año
const festivos = [
  "2024-01-01", // Año Nuevo
  "2024-03-25", // Lunes Santo
  "2024-03-28", // Jueves Santo
  "2024-03-29", // Viernes Santo
  "2024-05-01", // Día del Trabajador
  "2024-11-11", // Independencia de Cartagena
  "2024-12-25" // Navidad
];

// Función para calcular los días hábiles del mes actual
const calcularDiasHabiles = () => {
  const diasHabiles = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();
      const isSunday = dayOfWeek === 0;
      const isFestivo = festivos.includes(currentDate.toISOString().split("T")[0]);

      // Considerar días hábiles de lunes a sábado, excluyendo domingos y festivos
      if (!isSunday && !isFestivo) {
          diasHabiles.push(currentDate);
      }
  }
  return diasHabiles;
};

export function CantidadPorDiaLaboral(constInsp) {
  const diasHabiles = calcularDiasHabiles();
  const semanas = [];
  let semanaActual = { dias: 0, cantidad: 0 };
  let currentWeekNumber = diasHabiles[0] ? getWeekNumber(diasHabiles[0]) : 0;
  let weekCount = 1;
  let totalCantidad = 0;

  diasHabiles.forEach(dia => {
      const semanaDia = getWeekNumber(dia);

      if (semanaDia !== currentWeekNumber) {
          semanas.push({ [`semana_${weekCount}`]: semanaActual });
          semanaActual = { dias: 0, cantidad: 0 };
          currentWeekNumber = semanaDia;
          weekCount++;
      }

      semanaActual.dias += 1;
      semanaActual.cantidad = Math.round(semanaActual.dias * constInsp);
  });

  semanas.push({ [`semana_${weekCount}`]: semanaActual });
  
  totalCantidad = semanas.reduce((acc, semana) => {
      const key = Object.keys(semana)[0];
      return acc + semana[key].cantidad;
  }, 0);

  semanas.push({ totales: totalCantidad });

  return semanas;
}

// Función para obtener el número de semana del año
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

