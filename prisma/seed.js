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
var _this = this;
var PrismaClient = require("@prisma/client").PrismaClient;
var attendance = require("./seeds/attendance");
var category = require("./seeds/category");
var day = require("./seeds/day");
var employeeType = require("./seeds/employee-type");
var gender = require("./seeds/gender");
var hours = require("./seeds/hour");
var incident = require("./seeds/incident");
var incidentStatus = require("./seeds/incident-status");
var locations = require("./seeds/location");
var requests = require("./seeds/request");
var requestStatus = require("./seeds/request-status");
var roles = require("./seeds/roles");
var statusEmployee = require("./seeds/status-employee");
var direccion = require("./seeds/direccion");
var secretaria = require("./seeds/secretaria");
var country = require("./seeds/country");
var state = require("./seeds/state");
var municipality = require("./seeds/municipality");
var identificationType = require("./seeds/identification-type");
var maritalStatus = require("./seeds/marital-status");
var occupation = require("./seeds/occupation");
var profession = require("./seeds/profession");
var schooling = require("./seeds/schooling");
var tradeUnion = require("./seeds/trade-union");
var prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Start seeding...");
                    return [4 /*yield*/, prisma.attendance.createMany({ data: attendance })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prisma.category.createMany({ data: category })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.day.createMany({ data: day })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.employeeType.createMany({ data: employeeType })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.gender.createMany({ data: gender })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.hour.createMany({ data: hours })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.incident.createMany({ data: incident })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.incidentStatus.createMany({ data: incidentStatus })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, prisma.location.createMany({ data: locations })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, prisma.request.createMany({ data: requests })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, prisma.requestStatus.createMany({ data: requestStatus })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, prisma.role.createMany({ data: roles })];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, prisma.statusEmployee.createMany({ data: statusEmployee })];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, prisma.secretaria.createMany({ data: secretaria })];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, prisma.direccion.createMany({ data: direccion })];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, prisma.country.createMany({ data: country })];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, prisma.state.createMany({ data: state })];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, prisma.municipality.createMany({ data: municipality })];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, prisma.identificationType.createMany({ data: identificationType })];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, prisma.maritalStatus.createMany({ data: maritalStatus })];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, prisma.occupation.createMany({ data: occupation })];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, prisma.profession.createMany({ data: profession })];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, prisma.schooling.createMany({ data: schooling })];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, prisma.tradeUnion.createMany({ data: tradeUnion })];
                case 24:
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
    .finally(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
