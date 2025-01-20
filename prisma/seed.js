"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var attendance_1 = require("./seeds/attendance");
var category_1 = require("./seeds/category");
var day_1 = require("./seeds/day");
var employee_type_1 = require("./seeds/employee-type");
var gender_1 = require("./seeds/gender");
var hour_1 = require("./seeds/hour");
var incident_1 = require("./seeds/incident");
var incident_status_1 = require("./seeds/incident-status");
var location_1 = require("./seeds/location");
var payroll_1 = require("./seeds/payroll");
var request_1 = require("./seeds/request");
var request_status_1 = require("./seeds/request-status");
var roles_1 = require("./seeds/roles");
var status_employee_1 = require("./seeds/status-employee");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Start seeding...");
                    return [4 /*yield*/, prisma.attendance.createMany({ data: attendance_1.attendance })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prisma.category.createMany({ data: category_1.category })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.day.createMany({ data: day_1.day })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.employeeType.createMany({ data: employee_type_1.employeeType })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.gender.createMany({ data: gender_1.gender })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.hour.createMany({ data: hour_1.hours })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.incident.createMany({ data: incident_1.incident })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.incidentStatus.createMany({ data: incident_status_1.incidentStatus })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, prisma.location.createMany({ data: location_1.location })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, prisma.payroll.createMany({ data: payroll_1.payroll })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, prisma.request.createMany({ data: request_1.requests })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, prisma.requestStatus.createMany({ data: request_status_1.requestStatus })];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, prisma.role.createMany({ data: roles_1.roles })];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, prisma.statusEmployee.createMany({ data: status_employee_1.statusEmployee })];
                case 14:
                    _a.sent();
                    console.log("Seeding finished.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error("Error during seeding:", e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
