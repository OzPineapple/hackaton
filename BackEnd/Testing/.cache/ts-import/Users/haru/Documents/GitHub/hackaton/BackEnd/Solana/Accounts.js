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
exports.HacerTrans = exports.CalCost = exports.SistemaCuentas = void 0;
var web3_js_1 = require("@solana/web3.js");
//import { KeyGen } from "./Bases";
var bs58 = require("bs58");
//Crea el sistema de cuentas
function SistemaCuentas() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, fromPubkey, airdropSignature, space, rentExemptionAmount, newAccountPubkey, createAccountParams, createAccountTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
                    fromPubkey = web3_js_1.Keypair.generate();
                    return [4 /*yield*/, connection.requestAirdrop(fromPubkey.publicKey, web3_js_1.LAMPORTS_PER_SOL)];
                case 1:
                    airdropSignature = _a.sent();
                    return [4 /*yield*/, connection.confirmTransaction(airdropSignature)];
                case 2:
                    _a.sent();
                    space = 0;
                    return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(space)];
                case 3:
                    rentExemptionAmount = _a.sent();
                    newAccountPubkey = web3_js_1.Keypair.generate();
                    ;
                    createAccountParams = {
                        fromPubkey: fromPubkey.publicKey,
                        newAccountPubkey: newAccountPubkey.publicKey,
                        lamports: rentExemptionAmount,
                        space: space,
                        programId: web3_js_1.SystemProgram.programId,
                    };
                    createAccountTransaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccount(createAccountParams));
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, createAccountTransaction, [
                            fromPubkey,
                            newAccountPubkey,
                        ])];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.SistemaCuentas = SistemaCuentas;
crearCuenta(web3_js_1.Keypair.generate());
//Calcula el costo de las cuentas
var CalCost;
(function (CalCost) {
    function calCon() {
        return __awaiter(this, void 0, void 0, function () {
            var connection, dataLength, rentExemptionAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
                        dataLength = 1500;
                        return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(dataLength)];
                    case 1:
                        rentExemptionAmount = _a.sent();
                        console.log({
                            rentExemptionAmount: rentExemptionAmount,
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
    CalCost.calCon = calCon;
})(CalCost = exports.CalCost || (exports.CalCost = {}));
//Creando una cuenta
//export module CrearCuenta{
/*export*/ function crearCuenta(key) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, feePayer, base, basePubkey, seed, programId, derived, tx, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
                    feePayer = web3_js_1.Keypair.fromSecretKey(bs58.decode(key));
                    base = web3_js_1.Keypair.fromSecretKey(bs58.decode(key));
                    basePubkey = base.publicKey;
                    seed = "robot001";
                    programId = web3_js_1.SystemProgram.programId;
                    return [4 /*yield*/, web3_js_1.PublicKey.createWithSeed(basePubkey, seed, programId)];
                case 1:
                    derived = _d.sent();
                    tx = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccountWithSeed({
                        fromPubkey: feePayer.publicKey,
                        newAccountPubkey: derived,
                        basePubkey: basePubkey,
                        seed: seed,
                        lamports: 1e8,
                        space: 0,
                        programId: programId,
                    }));
                    _b = (_a = console).log;
                    _c = "txhash: ".concat;
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, tx, [
                            feePayer,
                            base,
                        ])];
                case 2:
                    _b.apply(_a, [_c.apply("txhash: ", [_d.sent()])]);
                    return [2 /*return*/];
            }
        });
    });
}
//}
//Transferencia
var HacerTrans;
(function (HacerTrans) {
    function hacerTrans(key) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, feePayer, base, basePubkey, seed, programId, derived, tx, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
                        feePayer = web3_js_1.Keypair.fromSecretKey(bs58.decode(key));
                        base = web3_js_1.Keypair.fromSecretKey(bs58.decode(key));
                        basePubkey = base.publicKey;
                        seed = "robot001";
                        programId = web3_js_1.SystemProgram.programId;
                        return [4 /*yield*/, web3_js_1.PublicKey.createWithSeed(basePubkey, seed, programId)];
                    case 1:
                        derived = _d.sent();
                        tx = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
                            fromPubkey: derived,
                            basePubkey: basePubkey,
                            toPubkey: web3_js_1.Keypair.generate().publicKey,
                            lamports: 0.01 * web3_js_1.LAMPORTS_PER_SOL,
                            seed: seed,
                            programId: programId,
                        }));
                        _b = (_a = console).log;
                        _c = "txhash: ".concat;
                        return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, tx, [
                                feePayer,
                                base,
                            ])];
                    case 2:
                        _b.apply(_a, [_c.apply("txhash: ", [_d.sent()])]);
                        return [2 /*return*/];
                }
            });
        });
    }
    HacerTrans.hacerTrans = hacerTrans;
})(HacerTrans = exports.HacerTrans || (exports.HacerTrans = {}));
