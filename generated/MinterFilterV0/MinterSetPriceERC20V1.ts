// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class PricePerTokenInWeiUpdated extends ethereum.Event {
  get params(): PricePerTokenInWeiUpdated__Params {
    return new PricePerTokenInWeiUpdated__Params(this);
  }
}

export class PricePerTokenInWeiUpdated__Params {
  _event: PricePerTokenInWeiUpdated;

  constructor(event: PricePerTokenInWeiUpdated) {
    this._event = event;
  }

  get _projectId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get _pricePerTokenInWei(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class ProjectCurrencyInfoUpdated extends ethereum.Event {
  get params(): ProjectCurrencyInfoUpdated__Params {
    return new ProjectCurrencyInfoUpdated__Params(this);
  }
}

export class ProjectCurrencyInfoUpdated__Params {
  _event: ProjectCurrencyInfoUpdated;

  constructor(event: ProjectCurrencyInfoUpdated) {
    this._event = event;
  }

  get _projectId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get _currencyAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _currencySymbol(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class PurchaseToDisabledUpdated extends ethereum.Event {
  get params(): PurchaseToDisabledUpdated__Params {
    return new PurchaseToDisabledUpdated__Params(this);
  }
}

export class PurchaseToDisabledUpdated__Params {
  _event: PurchaseToDisabledUpdated;

  constructor(event: PurchaseToDisabledUpdated) {
    this._event = event;
  }

  get _projectId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get _purchaseToDisabled(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }
}

export class MinterSetPriceERC20V1__getPriceInfoResult {
  value0: boolean;
  value1: BigInt;
  value2: string;
  value3: Address;

  constructor(
    value0: boolean,
    value1: BigInt,
    value2: string,
    value3: Address
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromBoolean(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromString(this.value2));
    map.set("value3", ethereum.Value.fromAddress(this.value3));
    return map;
  }
}

export class MinterSetPriceERC20V1 extends ethereum.SmartContract {
  static bind(address: Address): MinterSetPriceERC20V1 {
    return new MinterSetPriceERC20V1("MinterSetPriceERC20V1", address);
  }

  checkYourAllowanceOfProjectERC20(_projectId: BigInt): BigInt {
    let result = super.call(
      "checkYourAllowanceOfProjectERC20",
      "checkYourAllowanceOfProjectERC20(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );

    return result[0].toBigInt();
  }

  try_checkYourAllowanceOfProjectERC20(
    _projectId: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "checkYourAllowanceOfProjectERC20",
      "checkYourAllowanceOfProjectERC20(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  genArt721CoreAddress(): Address {
    let result = super.call(
      "genArt721CoreAddress",
      "genArt721CoreAddress():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_genArt721CoreAddress(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "genArt721CoreAddress",
      "genArt721CoreAddress():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getPriceInfo(_projectId: BigInt): MinterSetPriceERC20V1__getPriceInfoResult {
    let result = super.call(
      "getPriceInfo",
      "getPriceInfo(uint256):(bool,uint256,string,address)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );

    return new MinterSetPriceERC20V1__getPriceInfoResult(
      result[0].toBoolean(),
      result[1].toBigInt(),
      result[2].toString(),
      result[3].toAddress()
    );
  }

  try_getPriceInfo(
    _projectId: BigInt
  ): ethereum.CallResult<MinterSetPriceERC20V1__getPriceInfoResult> {
    let result = super.tryCall(
      "getPriceInfo",
      "getPriceInfo(uint256):(bool,uint256,string,address)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new MinterSetPriceERC20V1__getPriceInfoResult(
        value[0].toBoolean(),
        value[1].toBigInt(),
        value[2].toString(),
        value[3].toAddress()
      )
    );
  }

  getYourBalanceOfProjectERC20(_projectId: BigInt): BigInt {
    let result = super.call(
      "getYourBalanceOfProjectERC20",
      "getYourBalanceOfProjectERC20(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );

    return result[0].toBigInt();
  }

  try_getYourBalanceOfProjectERC20(
    _projectId: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getYourBalanceOfProjectERC20",
      "getYourBalanceOfProjectERC20(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  minterFilterAddress(): Address {
    let result = super.call(
      "minterFilterAddress",
      "minterFilterAddress():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_minterFilterAddress(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "minterFilterAddress",
      "minterFilterAddress():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  minterType(): string {
    let result = super.call("minterType", "minterType():(string)", []);

    return result[0].toString();
  }

  try_minterType(): ethereum.CallResult<string> {
    let result = super.tryCall("minterType", "minterType():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  projectMaxHasBeenInvoked(param0: BigInt): boolean {
    let result = super.call(
      "projectMaxHasBeenInvoked",
      "projectMaxHasBeenInvoked(uint256):(bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toBoolean();
  }

  try_projectMaxHasBeenInvoked(param0: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "projectMaxHasBeenInvoked",
      "projectMaxHasBeenInvoked(uint256):(bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  projectMaxInvocations(param0: BigInt): BigInt {
    let result = super.call(
      "projectMaxInvocations",
      "projectMaxInvocations(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toBigInt();
  }

  try_projectMaxInvocations(param0: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "projectMaxInvocations",
      "projectMaxInvocations(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _genArt721Address(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _minterFilter(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class PurchaseCall extends ethereum.Call {
  get inputs(): PurchaseCall__Inputs {
    return new PurchaseCall__Inputs(this);
  }

  get outputs(): PurchaseCall__Outputs {
    return new PurchaseCall__Outputs(this);
  }
}

export class PurchaseCall__Inputs {
  _call: PurchaseCall;

  constructor(call: PurchaseCall) {
    this._call = call;
  }

  get _projectId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class PurchaseCall__Outputs {
  _call: PurchaseCall;

  constructor(call: PurchaseCall) {
    this._call = call;
  }

  get tokenId(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class PurchaseToCall extends ethereum.Call {
  get inputs(): PurchaseToCall__Inputs {
    return new PurchaseToCall__Inputs(this);
  }

  get outputs(): PurchaseToCall__Outputs {
    return new PurchaseToCall__Outputs(this);
  }
}

export class PurchaseToCall__Inputs {
  _call: PurchaseToCall;

  constructor(call: PurchaseToCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _projectId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class PurchaseToCall__Outputs {
  _call: PurchaseToCall;

  constructor(call: PurchaseToCall) {
    this._call = call;
  }

  get tokenId(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class SetProjectMaxInvocationsCall extends ethereum.Call {
  get inputs(): SetProjectMaxInvocationsCall__Inputs {
    return new SetProjectMaxInvocationsCall__Inputs(this);
  }

  get outputs(): SetProjectMaxInvocationsCall__Outputs {
    return new SetProjectMaxInvocationsCall__Outputs(this);
  }
}

export class SetProjectMaxInvocationsCall__Inputs {
  _call: SetProjectMaxInvocationsCall;

  constructor(call: SetProjectMaxInvocationsCall) {
    this._call = call;
  }

  get _projectId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetProjectMaxInvocationsCall__Outputs {
  _call: SetProjectMaxInvocationsCall;

  constructor(call: SetProjectMaxInvocationsCall) {
    this._call = call;
  }
}

export class UpdatePricePerTokenInWeiCall extends ethereum.Call {
  get inputs(): UpdatePricePerTokenInWeiCall__Inputs {
    return new UpdatePricePerTokenInWeiCall__Inputs(this);
  }

  get outputs(): UpdatePricePerTokenInWeiCall__Outputs {
    return new UpdatePricePerTokenInWeiCall__Outputs(this);
  }
}

export class UpdatePricePerTokenInWeiCall__Inputs {
  _call: UpdatePricePerTokenInWeiCall;

  constructor(call: UpdatePricePerTokenInWeiCall) {
    this._call = call;
  }

  get _projectId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _pricePerTokenInWei(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class UpdatePricePerTokenInWeiCall__Outputs {
  _call: UpdatePricePerTokenInWeiCall;

  constructor(call: UpdatePricePerTokenInWeiCall) {
    this._call = call;
  }
}

export class UpdateProjectCurrencyInfoCall extends ethereum.Call {
  get inputs(): UpdateProjectCurrencyInfoCall__Inputs {
    return new UpdateProjectCurrencyInfoCall__Inputs(this);
  }

  get outputs(): UpdateProjectCurrencyInfoCall__Outputs {
    return new UpdateProjectCurrencyInfoCall__Outputs(this);
  }
}

export class UpdateProjectCurrencyInfoCall__Inputs {
  _call: UpdateProjectCurrencyInfoCall;

  constructor(call: UpdateProjectCurrencyInfoCall) {
    this._call = call;
  }

  get _projectId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _currencySymbol(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _currencyAddress(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class UpdateProjectCurrencyInfoCall__Outputs {
  _call: UpdateProjectCurrencyInfoCall;

  constructor(call: UpdateProjectCurrencyInfoCall) {
    this._call = call;
  }
}
