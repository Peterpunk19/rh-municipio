import { NextResponse } from "next/server";
import seedAL_Base from "@/app/api/employee-payroll/tests/seeds/scenarios/al_lv_base";
import seedDC_LV_Inasistencia from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_inasistencia";
import seedDC_LV_Asistencia from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_asistencia";
import seedDC_LV_OmisionEntrada from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_omision_entrada";
import seedDC_LV_OmisionSalida from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_omision_salida";
import seedDC_LV_Retardos1 from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_retardos_1";
import seedDC_LV_Retardos3 from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_retardos_3";
import seedDC_LV_RetardoMayor from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_retardo_mayor";
import seedDC_LV_Nocturno from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_nocturno";
import seedDC_LV_Nocturno_Inasistencia from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_nocturno_inasistencia";
import seedDC_LV_Nocturno_OmisionSalida from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_nocturno_omision_salida";
import seedDC_LV_Nocturno_OmisionEntrada from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_nocturno_omision_entrada";
import seedDC_LV_PermisoSinGoce from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_permiso_sin_goce";
import seedDC_LS_FaltaSabado from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_ls_falta_sabado";
import seedDC_LS_InasistenciaSabado from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_ls_inasistencia_sabado";
import seedDC_LD_FaltaDomingo from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_ld_falta_domingo";
import seedDC_LD_InasistenciaDomingo from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_ld_inasistencia_domingo";
import seedDC_LV_Falta from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_falta";
import seedDC_LS_RetardoSabado from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_ls_retardo_sabado";
import seedDC_LD_RetardoDomingo from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_ld_retardo_domingo";
import seedDC_LMV_Asistencia from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lmv_asistencia";
import seedDC_LMV_Inasistencia from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lmv_inasistencia";
import seedDC_LMV_Falta from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lmv_falta";
import seedDC_LMV_OmisionEntrada from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lmv_omision_entrada";
import seedDC_LMV_OmisionSalida from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lmv_omision_salida";
import seedDC_LMV_Retardos1 from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lmv_retardos1";
import seedDC_LMV_Retardos3 from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lmv_retardos3";
import seedDC_LMV_RetardoMayor from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lmv_retardo_mayor";
import seedDC_LMV_PermisoSinGoce from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lmv_permiso_sin_goce";
import seedDC_MSD_Falta from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_msd_falta";
import seedDC_MSD_FaltaSabadoDomingo from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_msd_falta_sabado_domingo";
import seedDC_MSD_FaltaSabadoInasistenciaDomingo from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_msd_falta_sabado_inasistencia_domingo";
import seedDC_MSD_Inasistencia from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_msd_inasistencia";
import seedDC_MSD_InasistenciaSabadoDomingo from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_msd_inasistencia_sabado_domingo";
import seedDC_MSD_InasistenciaSabadoFaltaDomingo from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_msd_inasistencia_sabado_falta_domingo";
import seedDC_LS_OmisionEntrada from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_ls_omision_entrada";
import seedDC_LS_OmisionSalida from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_ls_omision_salida";
import seedDC_LS_Retardos3 from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_ls_retardos_3";
import seedDC_LS_RetardoMayor from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_ls_retardo_mayor";
import seedAL_VSD_Asistencia from "@/app/api/employee-payroll/tests/seeds/scenarios/al_vsd_asistencia";
import seedAL_VSD_Falta_Sabado from "@/app/api/employee-payroll/tests/seeds/scenarios/al_vsd_falta_sabado";
import seedAL_VSD_Falta_Domingo from "@/app/api/employee-payroll/tests/seeds/scenarios/al_vsd_falta_domingo";
import seedAL_VSD_Falta_Viernes from "@/app/api/employee-payroll/tests/seeds/scenarios/al_vsd_falta_viernes";
import seedAL_LV_PermisoSinGoce from "@/app/api/employee-payroll/tests/seeds/scenarios/al_lv_permiso_sin_goce";
import seedIntercalated_LMV_Base from "@/app/api/employee-payroll/tests/seeds/scenarios/intercalated_lmv_base";
import seedIntercalated_LMV_OmisionEntrada from "@/app/api/employee-payroll/tests/seeds/scenarios/intercalated_lmv_omision_entrada";
import seedIntercalated_LMV_OmisionSalida from "@/app/api/employee-payroll/tests/seeds/scenarios/intercalated_lmv_omision_salida";
import seedIntercalated_LMV_Retardo1 from "@/app/api/employee-payroll/tests/seeds/scenarios/intercalated_lmv_retardo1";
import seedIntercalated_LMV_Retardos3 from "@/app/api/employee-payroll/tests/seeds/scenarios/intercalated_lmv_retardos3";
import seedIntercalated_LMV_RetardoMayor from "@/app/api/employee-payroll/tests/seeds/scenarios/intercalated_lmv_retardo_mayor";
import seedIntercalated_LMV_PermisoSinGoce from "@/app/api/employee-payroll/tests/seeds/scenarios/intercalated_lmv_permiso_sin_goce";
import seedIntercalated_LMS_InasistenciaSabado from "@/app/api/employee-payroll/tests/seeds/scenarios/intercalated_lms_inasistencia_sabado";
import seedIntercalated_LMSD_InasistenciaDomingo from "@/app/api/employee-payroll/tests/seeds/scenarios/intercalated_lmsd_inasistencia_domingo";
import seedDC_Complex from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_complex";
import seedDC_Complex_Retardos3OmisionEntradaOmisionSalida from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_complex_retardos3_omision_entrada_omision_salida";
import seedDC_Complex_InasistenciaViernesSabadoDomingo from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_complex_inasistencia_viernes_sabado_domingo";
import seedDC_Complex_RetardoMayorPermisoSinGoce from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_complex_retardo_mayor_permiso_sin_goce";
import seedIntercalated_LMV_InasistenciaTotal from "@/app/api/employee-payroll/tests/seeds/scenarios/intercalated_lmv_inasistencia_total";
import seedDC_LV_Nocturno_OmisionSalidaInasistencia from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_lv_nocturno_omision_salida_inasistencia";
import seedAL_VSD_Falta_SabadoDomingo from "@/app/api/employee-payroll/tests/seeds/scenarios/al_vsd_falta_sabado_domingo";
import seedDC_Complex_AllIncidencias01 from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_complex_all_incidencias01";
import seedDC_Complex_AllIncidencias02 from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_complex_all_incidencias02";
import { seedAL_IncapacidadMenor1Anio_30Dias } from "@/app/api/employee-payroll/tests/seeds/scenarios/al_incapacidad_menor_1_30_dias";
import { seedAL_IncapacidadMenor1Anio_45Dias } from "@/app/api/employee-payroll/tests/seeds/scenarios/al_incapacidad_menor_1_45_dias";
import { seedAL_Incapacidad_1a5_30Dias } from "@/app/api/employee-payroll/tests/seeds/scenarios/al_incapacidad_1_5_30_dias";
import { seedAL_Incapacidad_1a5_60Dias } from "@/app/api/employee-payroll/tests/seeds/scenarios/al_incapacidad_1_5_60_dias";
import { seedAL_Incapacidad_1a5_75Dias } from "@/app/api/employee-payroll/tests/seeds/scenarios/al_incapacidad_1_5_75_dias";
import { seedAL_IncapacidadMayor10_2FoliosContinuos } from "@/app/api/employee-payroll/tests/seeds/scenarios/al_incapacidad_mayor_10_2_folios";
import { seedAL_IncapacidadRuptura } from "@/app/api/employee-payroll/tests/seeds/scenarios/al_incapacidad_mayor_10_ruptura";
import { seedDC_Incapacidad_1a5_30Dias } from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_incapacidad_1_5_30_dias";
import { seedDC_IncapacidadMenor1Anio_30Dias } from "@/app/api/employee-payroll/tests/seeds/scenarios/dc_incapacidad_menor_1_30_dias";
import { seedIntercalated_IncapacidadMenor1Anio_30Dias } from "@/app/api/employee-payroll/tests/seeds/scenarios/intercalated_incapacidad_menor_1_30_dias";
import { seedIntercalated_IncapacidadMenor1Anio_5Dias_PermisoSinGoce } from "@/app/api/employee-payroll/tests/seeds/scenarios/intercalated_incapacidad_menor_1_5_dias_permiso_sin_goce";

const REQUIRED_SECRET = process.env.SEED_SECRET ?? "dev_secret";

export async function GET(req: Request) {
  try {
    // 1. Bloquear en producción sin token
    if (process.env.NODE_ENV === "production") {
      const headerSecret = req.headers.get("x-seed-secret");
      if (headerSecret !== REQUIRED_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // 3. Ejecutar seeds
    console.log("🌱 Sembrando escenarios de nómina de prueba...");

    let numberEmployee = 173800;

    await seedDC_LV_Asistencia(String(numberEmployee++));
    await seedDC_LV_Inasistencia(String(numberEmployee++));
    await seedDC_LV_Falta(String(numberEmployee++));
    await seedDC_LV_OmisionEntrada(String(numberEmployee++));
    await seedDC_LV_OmisionSalida(String(numberEmployee++));
    await seedDC_LV_Retardos1(String(numberEmployee++));
    await seedDC_LV_Retardos3(String(numberEmployee++));
    await seedDC_LV_RetardoMayor(String(numberEmployee++));
    await seedDC_LV_PermisoSinGoce(String(numberEmployee++));
    await seedDC_LV_Nocturno(String(numberEmployee++));
    await seedDC_LV_Nocturno_Inasistencia(String(numberEmployee++));
    await seedDC_LV_Nocturno_OmisionSalida(String(numberEmployee++));
    await seedDC_LV_Nocturno_OmisionEntrada(String(numberEmployee++));
    await seedDC_LV_Nocturno_OmisionSalidaInasistencia(String(numberEmployee++));
    await seedDC_LMV_Asistencia(String(numberEmployee++));
    await seedDC_LMV_Inasistencia(String(numberEmployee++));
    await seedDC_LMV_Falta(String(numberEmployee++));
    await seedDC_LMV_OmisionEntrada(String(numberEmployee++));
    await seedDC_LMV_OmisionSalida(String(numberEmployee++));
    await seedDC_LMV_Retardos1(String(numberEmployee++));
    await seedDC_LMV_Retardos3(String(numberEmployee++));
    await seedDC_LMV_RetardoMayor(String(numberEmployee++));
    await seedDC_LMV_PermisoSinGoce(String(numberEmployee++));
    await seedDC_MSD_Falta(String(numberEmployee++));
    await seedDC_MSD_Inasistencia(String(numberEmployee++));
    await seedDC_MSD_FaltaSabadoDomingo(String(numberEmployee++));
    await seedDC_MSD_InasistenciaSabadoDomingo(String(numberEmployee++));
    await seedDC_MSD_FaltaSabadoInasistenciaDomingo(String(numberEmployee++));
    await seedDC_MSD_InasistenciaSabadoFaltaDomingo(String(numberEmployee++));
    await seedDC_LS_FaltaSabado(String(numberEmployee++));
    await seedDC_LS_InasistenciaSabado(String(numberEmployee++));
    await seedDC_LS_RetardoSabado(String(numberEmployee++));
    await seedDC_LS_Retardos3(String(numberEmployee++));
    await seedDC_LS_RetardoMayor(String(numberEmployee++));
    await seedDC_LS_OmisionEntrada(String(numberEmployee++));
    await seedDC_LS_OmisionSalida(String(numberEmployee++));
    await seedDC_LD_FaltaDomingo(String(numberEmployee++));
    await seedDC_LD_InasistenciaDomingo(String(numberEmployee++));
    await seedDC_LD_RetardoDomingo(String(numberEmployee++));

    await seedAL_Base(String(numberEmployee++));
    await seedAL_LV_PermisoSinGoce(String(numberEmployee++));
    await seedAL_VSD_Asistencia(String(numberEmployee++));
    await seedAL_VSD_Falta_Viernes(String(numberEmployee++));
    await seedAL_VSD_Falta_Sabado(String(numberEmployee++));
    await seedAL_VSD_Falta_Domingo(String(numberEmployee++));
    await seedAL_VSD_Falta_SabadoDomingo(String(numberEmployee++));

    await seedIntercalated_LMV_Base(String(numberEmployee++));
    await seedIntercalated_LMV_OmisionEntrada(String(numberEmployee++));
    await seedIntercalated_LMV_OmisionSalida(String(numberEmployee++));
    await seedIntercalated_LMV_Retardo1(String(numberEmployee++));
    await seedIntercalated_LMV_Retardos3(String(numberEmployee++));
    await seedIntercalated_LMV_RetardoMayor(String(numberEmployee++));
    await seedIntercalated_LMV_PermisoSinGoce(String(numberEmployee++));
    await seedIntercalated_LMV_InasistenciaTotal(String(numberEmployee++));
    await seedIntercalated_LMS_InasistenciaSabado(String(numberEmployee++));
    await seedIntercalated_LMSD_InasistenciaDomingo(String(numberEmployee++));

    await seedDC_Complex(String(numberEmployee++));
    await seedDC_Complex_Retardos3OmisionEntradaOmisionSalida(String(numberEmployee++));
    await seedDC_Complex_InasistenciaViernesSabadoDomingo(String(numberEmployee++));
    await seedDC_Complex_RetardoMayorPermisoSinGoce(String(numberEmployee++));
    await seedDC_Complex_AllIncidencias01(String(numberEmployee++));
    await seedDC_Complex_AllIncidencias02(String(numberEmployee++));

    await seedAL_IncapacidadMenor1Anio_30Dias(String(numberEmployee++));
    await seedAL_IncapacidadMenor1Anio_45Dias(String(numberEmployee++));
    await seedAL_Incapacidad_1a5_30Dias(String(numberEmployee++));
    await seedAL_Incapacidad_1a5_60Dias(String(numberEmployee++));
    await seedAL_Incapacidad_1a5_75Dias(String(numberEmployee++));
    await seedAL_IncapacidadMayor10_2FoliosContinuos(String(numberEmployee++));
    await seedAL_IncapacidadRuptura(String(numberEmployee++));

    await seedDC_Incapacidad_1a5_30Dias(String(numberEmployee++));
    await seedDC_IncapacidadMenor1Anio_30Dias(String(numberEmployee++));

    await seedIntercalated_IncapacidadMenor1Anio_30Dias(String(numberEmployee++));
    await seedIntercalated_IncapacidadMenor1Anio_5Dias_PermisoSinGoce(String(numberEmployee++));

    console.log("✅ Seeds completados.");

    return NextResponse.json({
      message: "Seeds de nómina ejecutados correctamente.",
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed", details: error.message }, { status: 500 });
  }
}
