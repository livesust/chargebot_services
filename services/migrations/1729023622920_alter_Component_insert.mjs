import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.insertInto('component')
    .values([
      {
        "id": 1,
        "name": "Raspberry Pi",
        "version": "4",
        "specs": "4GB Model B"
      },
      {
        "id": 2,
        "name": "LTE/GPS Modem",
        "version": "EC25AFA-MINIPCIE",
        "specs": "Quectel EC25AFA-MINIPCIE"
      },
      {
        "id": 3,
        "name": "SanDisk SD Card",
        "version": "Ultra SDHC UHS-I",
        "specs": "32GB, 120 MB/s"
      },
      {
        "id": 4,
        "name": "EG4 Battery",
        "version": "LifePower4",
        "specs": "51.2V, 100Ah, 5120Wh"
      },
      {
        "id": 5,
        "name": "TGPro Battery",
        "version": "TH-51100-R1",
        "specs": "16S1P-51.2V100Ah"
      },
      {
        "id": 6,
        "name": "SRNE Inverter",
        "version": "HFP4835U80-145",
        "specs": "48V, 3500W, 6000VA, 110/120Vac"
      },
      {
        "id": 7,
        "name": "CyberPower PDU",
        "version": "PDU41001",
        "specs": "8-Outlet, 100-120V/15A"
      },
      {
        "id": 8,
        "name": "Pigpio Fan Control",
        "version": "CFM-120C Relay",
        "specs": ""
      },
      {
        "id": 9,
        "name": "SparkFan Fan Control",
        "version": "Qwiic Single Relay",
        "specs": ""
      },
      {
        "id": 10,
        "name": "SparkFun Temperature Sensor",
        "version": "STTS22H",
        "specs": "-40°C to +125°C"
      },
      {
        "id": 11,
        "name": "SparkFun Temperature Sensor",
        "version": "Qwiic AS6212",
        "specs": "-40°C to +125°C"
      }
  ])
  .execute()
}

/**
 * @param db {Kysely<any>}
 */
export async function down(_) {
}