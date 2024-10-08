import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.insertInto('state_master')
    .values([
      {
          "abbreviation": "AL",
          "name": "Alabama",
          "country": "US"
      },
      {
          "abbreviation": "AK",
          "name": "Alaska",
          "country": "US"
      },
      {
          "abbreviation": "AS",
          "name": "American Samoa",
          "country": "US"
      },
      {
          "abbreviation": "AZ",
          "name": "Arizona",
          "country": "US"
      },
      {
          "abbreviation": "AR",
          "name": "Arkansas",
          "country": "US"
      },
      {
          "abbreviation": "CA",
          "name": "California",
          "country": "US"
      },
      {
          "abbreviation": "CO",
          "name": "Colorado",
          "country": "US"
      },
      {
          "abbreviation": "CT",
          "name": "Connecticut",
          "country": "US"
      },
      {
          "abbreviation": "DE",
          "name": "Delaware",
          "country": "US"
      },
      {
          "abbreviation": "DC",
          "name": "District of Columbia",
          "country": "US"
      },
      {
          "abbreviation": "FM",
          "name": "Federated States of Micronesia",
          "country": "US"
      },
      {
          "abbreviation": "FL",
          "name": "Florida",
          "country": "US"
      },
      {
          "abbreviation": "GA",
          "name": "Georgia",
          "country": "US"
      },
      {
          "abbreviation": "GU",
          "name": "Guam",
          "country": "US"
      },
      {
          "abbreviation": "HI",
          "name": "Hawaii",
          "country": "US"
      },
      {
          "abbreviation": "ID",
          "name": "Idaho",
          "country": "US"
      },
      {
          "abbreviation": "IL",
          "name": "Illinois",
          "country": "US"
      },
      {
          "abbreviation": "IN",
          "name": "Indiana",
          "country": "US"
      },
      {
          "abbreviation": "IA",
          "name": "Iowa",
          "country": "US"
      },
      {
          "abbreviation": "KS",
          "name": "Kansas",
          "country": "US"
      },
      {
          "abbreviation": "KY",
          "name": "Kentucky",
          "country": "US"
      },
      {
          "abbreviation": "LA",
          "name": "Louisiana",
          "country": "US"
      },
      {
          "abbreviation": "ME",
          "name": "Maine",
          "country": "US"
      },
      {
          "abbreviation": "MH",
          "name": "Marshall Islands",
          "country": "US"
      },
      {
          "abbreviation": "MA",
          "name": "Massachusetts",
          "country": "US"
      },
      {
          "abbreviation": "MI",
          "name": "Michigan",
          "country": "US"
      },
      {
          "abbreviation": "MN",
          "name": "Minnesota",
          "country": "US"
      },
      {
          "abbreviation": "MS",
          "name": "Mississippi",
          "country": "US"
      },
      {
          "abbreviation": "MO",
          "name": "Missouri",
          "country": "US"
      },
      {
          "abbreviation": "MT",
          "name": "Montana",
          "country": "US"
      },
      {
          "abbreviation": "NE",
          "name": "Nebraska",
          "country": "US"
      },
      {
          "abbreviation": "NV",
          "name": "Nevada",
          "country": "US"
      },
      {
          "abbreviation": "NH",
          "name": "New Hampshire",
          "country": "US"
      },
      {
          "abbreviation": "NJ",
          "name": "New Jersey",
          "country": "US"
      },
      {
          "abbreviation": "NM",
          "name": "New Mexico",
          "country": "US"
      },
      {
          "abbreviation": "NY",
          "name": "New York",
          "country": "US"
      },
      {
          "abbreviation": "NC",
          "name": "North Carolina",
          "country": "US"
      },
      {
          "abbreviation": "ND",
          "name": "North Dakota",
          "country": "US"
      },
      {
          "abbreviation": "MP",
          "name": "Northern Mariana Islands",
          "country": "US"
      },
      {
          "abbreviation": "OH",
          "name": "Ohio",
          "country": "US"
      },
      {
          "abbreviation": "OK",
          "name": "Oklahoma",
          "country": "US"
      },
      {
          "abbreviation": "OR",
          "name": "Oregon",
          "country": "US"
      },
      {
          "abbreviation": "PW",
          "name": "Palau",
          "country": "US"
      },
      {
          "abbreviation": "PA",
          "name": "Pennsylvania",
          "country": "US"
      },
      {
          "abbreviation": "PR",
          "name": "Puerto Rico",
          "country": "US"
      },
      {
          "abbreviation": "RI",
          "name": "Rhode Island",
          "country": "US"
      },
      {
          "abbreviation": "SC",
          "name": "South Carolina",
          "country": "US"
      },
      {
          "abbreviation": "SD",
          "name": "South Dakota",
          "country": "US"
      },
      {
          "abbreviation": "TN",
          "name": "Tennessee",
          "country": "US"
      },
      {
          "abbreviation": "TX",
          "name": "Texas",
          "country": "US"
      },
      {
          "abbreviation": "UT",
          "name": "Utah",
          "country": "US"
      },
      {
          "abbreviation": "VT",
          "name": "Vermont",
          "country": "US"
      },
      {
          "abbreviation": "VI",
          "name": "Virgin Islands",
          "country": "US"
      },
      {
          "abbreviation": "VA",
          "name": "Virginia",
          "country": "US"
      },
      {
          "abbreviation": "WA",
          "name": "Washington",
          "country": "US"
      },
      {
          "abbreviation": "WV",
          "name": "West Virginia",
          "country": "US"
      },
      {
          "abbreviation": "WI",
          "name": "Wisconsin",
          "country": "US"
      },
      {
          "abbreviation": "WY",
          "name": "Wyoming",
          "country": "US"
      }
  ])
    .execute()
}

/**
 * @param db {Kysely<any>}
 */
export async function down(_) {
}