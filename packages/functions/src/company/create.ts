import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { Company } from "@chargebot-services/core/services/company";
import auditCreation from "../shared/middlewares/audit-create";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CreateCompanySchema, CompanyResponseSchema } from "./company.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any, context: any) => {
    console.log('Request to create Company:', event, context);
    const company = await Company.create(event.body);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: company
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(auditCreation())
    .use(validator({ eventSchema: CreateCompanySchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: CompanyResponseSchema }));