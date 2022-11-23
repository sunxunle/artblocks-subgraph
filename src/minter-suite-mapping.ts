// We're importing these event types from MinterSetPriceV0
// but the signature should be the same for all filtered minters
import {
  Address,
  BigInt,
  Bytes,
  ethereum,
  json,
  JSONValue,
  JSONValueKind,
  TypedMap,
  log
} from "@graphprotocol/graph-ts";

import {
  PricePerTokenInWeiUpdated,
  ProjectCurrencyInfoUpdated,
  PurchaseToDisabledUpdated
} from "../generated/MinterSetPriceV0/IFilteredMinterV0";

import {
  MinimumAuctionLengthSecondsUpdated as MinimumAuctionLengthSecondsUpdatedV0,
  ResetAuctionDetails as DALinV0ResetAuctionDetails,
  SetAuctionDetails as DALinV0SetAuctionDetails
} from "../generated/MinterDALinV0/MinterDALinV0";

import {
  MinimumAuctionLengthSecondsUpdated as MinimumAuctionLengthSecondsUpdatedV1,
  ResetAuctionDetails as DALinV1ResetAuctionDetails,
  SetAuctionDetails as DALinV1SetAuctionDetails
} from "../generated/MinterDALinV1/MinterDALinV1";

import {
  MinimumAuctionLengthSecondsUpdated as MinimumAuctionLengthSecondsUpdatedV2,
  ResetAuctionDetails as DALinV2ResetAuctionDetails,
  SetAuctionDetails as DALinV2SetAuctionDetails
} from "../generated/MinterDALinV2/MinterDALinV2";

import {
  AuctionHalfLifeRangeSecondsUpdated as AuctionHalfLifeRangeSecondsUpdatedV0,
  ResetAuctionDetails as DAExpV0ResetAuctionDetails,
  SetAuctionDetails as DAExpV0SetAuctionDetails
} from "../generated/MinterDAExpV0/MinterDAExpV0";

import {
  AuctionHalfLifeRangeSecondsUpdated as AuctionHalfLifeRangeSecondsUpdatedV1,
  ResetAuctionDetails as DAExpV1ResetAuctionDetails,
  SetAuctionDetails as DAExpV1SetAuctionDetails
} from "../generated/MinterDAExpV1/MinterDAExpV1";

import {
  AuctionHalfLifeRangeSecondsUpdated as AuctionHalfLifeRangeSecondsUpdatedV2,
  ResetAuctionDetails as DAExpV2ResetAuctionDetails,
  SetAuctionDetails as DAExpV2SetAuctionDetails
} from "../generated/MinterDAExpV2/MinterDAExpV2";

import {
  AuctionHalfLifeRangeSecondsUpdated as AuctionHalfLifeRangeSecondsUpdatedRefund,
  ResetAuctionDetails as DAExpRefundResetAuctionDetails,
  SetAuctionDetails as DAExpRefundSetAuctionDetails,
  ReceiptUpdated,
  SelloutPriceUpdated,
  ArtistAndAdminRevenuesWithdrawn,
  IFilteredMinterDAExpRefundV0
} from "../generated/MinterDAExpRefundV0/IFilteredMinterDAExpRefundV0";

import {
  Minter,
  Project,
  ProjectMinterConfiguration,
  Receipt
} from "../generated/schema";
import {
  arrayToJSONValue,
  booleanToString,
  bytesToJSONValue,
  generateContractSpecificId,
  getMinterDetails,
  getProjectMinterConfigId,
  loadOrCreateMinter,
  stringToJSONString,
  stringToJSONValue,
  typedMapToJSONString,
  loadOrCreateReceipt
} from "./helpers";
import {
  ConfigKeyRemoved,
  ConfigValueAddedToSet as ConfigValueAddedToSetBigInt,
  ConfigValueAddedToSet1 as ConfigValueAddedToSetAddress,
  ConfigValueAddedToSet2 as ConfigValueAddedToSetBytes,
  ConfigValueRemovedFromSet as ConfigValueRemovedFromSetBigInt,
  ConfigValueRemovedFromSet1 as ConfigValueRemovedFromSetAddress,
  ConfigValueRemovedFromSet2 as ConfigValueRemovedFromSetBytes,
  ConfigValueSet as ConfigValueSetBool,
  ConfigValueSet1 as ConfigValueSetBigInt,
  ConfigValueSet2 as ConfigValueSetAddress,
  ConfigValueSet3 as ConfigValueSetBytes
} from "../generated/MinterFilterV0/IFilteredMinterV1";
import {
  AllowedHoldersOfProjects as MinterHolderV0AllowedHoldersOfProjects,
  RegisteredNFTAddress as MinterHolderV0RegisteredNFTAddress,
  UnregisteredNFTAddress as MinterHolderV0UnregisteredNFTAddress,
  RemovedHoldersOfProjects as MinterHolderV0RemovedHoldersOfProjects
} from "../generated/MinterHolderV0/MinterHolderV0";
import {
  AllowedHoldersOfProjects as MinterHolderV1AllowedHoldersOfProjects,
  RegisteredNFTAddress as MinterHolderV1RegisteredNFTAddress,
  UnregisteredNFTAddress as MinterHolderV1UnregisteredNFTAddress,
  RemovedHoldersOfProjects as MinterHolderV1RemovedHoldersOfProjects
} from "../generated/MinterHolderV1/MinterHolderV1";
import { MinterConfigSetAddressEvent } from "./util-types";

// IFilteredMinterV0 events
export function handlePricePerTokenInWeiUpdated(
  event: PricePerTokenInWeiUpdated
): void {
  let minterProjectAndConfig = loadMinterProjectAndConfig(
    event.address,
    event.params._projectId,
    event.block.timestamp
  );

  if (!minterProjectAndConfig) {
    return;
  }

  let project = minterProjectAndConfig.project;
  let projectMinterConfig = minterProjectAndConfig.projectMinterConfiguration;

  projectMinterConfig.basePrice = event.params._pricePerTokenInWei;
  projectMinterConfig.priceIsConfigured = true;
  projectMinterConfig.save();

  project.updatedAt = event.block.timestamp;
  project.save();
}

export function handleProjectCurrencyInfoUpdated(
  event: ProjectCurrencyInfoUpdated
): void {
  let minterProjectAndConfig = loadMinterProjectAndConfig(
    event.address,
    event.params._projectId,
    event.block.timestamp
  );

  if (!minterProjectAndConfig) {
    return;
  }

  let project = minterProjectAndConfig.project;
  let projectMinterConfig = minterProjectAndConfig.projectMinterConfiguration;

  projectMinterConfig.currencyAddress = event.params._currencyAddress;
  projectMinterConfig.currencySymbol = event.params._currencySymbol;
  projectMinterConfig.save();

  project.updatedAt = event.block.timestamp;
  project.save();
}

export function handlePurchaseToDisabledUpdated(
  event: PurchaseToDisabledUpdated
): void {
  let minterProjectAndConfig = loadMinterProjectAndConfig(
    event.address,
    event.params._projectId,
    event.block.timestamp
  );

  if (!minterProjectAndConfig) {
    return;
  }

  let project = minterProjectAndConfig.project;
  let projectMinterConfig = minterProjectAndConfig.projectMinterConfiguration;

  projectMinterConfig.purchaseToDisabled = event.params._purchaseToDisabled;
  projectMinterConfig.save();

  project.updatedAt = event.block.timestamp;
  project.save();
}

// MinterDALin events

export function handleMinimumAuctionLengthSecondsUpdatedV0(
  event: MinimumAuctionLengthSecondsUpdatedV0
): void {
  handleMinimumAuctionLengthSecondsUpdatedGeneric(event);
}
export function handleMinimumAuctionLengthSecondsUpdatedV1(
  event: MinimumAuctionLengthSecondsUpdatedV1
): void {
  handleMinimumAuctionLengthSecondsUpdatedGeneric(event);
}
export function handleMinimumAuctionLengthSecondsUpdatedV2(
  event: MinimumAuctionLengthSecondsUpdatedV2
): void {
  handleMinimumAuctionLengthSecondsUpdatedGeneric(event);
}

export function handleMinimumAuctionLengthSecondsUpdatedGeneric<T>(
  event: T
): void {
  if (
    !(
      event instanceof MinimumAuctionLengthSecondsUpdatedV0 ||
      event instanceof MinimumAuctionLengthSecondsUpdatedV1 ||
      event instanceof MinimumAuctionLengthSecondsUpdatedV2
    )
  ) {
    return;
  }

  let minter = loadOrCreateMinter(event.address, event.block.timestamp);

  minter.minimumAuctionLengthInSeconds =
    event.params._minimumAuctionLengthSeconds;
  minter.updatedAt = event.block.timestamp;
  minter.save();
}

export function handleDALinSetAuctionDetailsV0(
  event: DALinV0SetAuctionDetails
): void {
  handleDALinSetAuctionDetailsGeneric(event);
}
export function handleDALinSetAuctionDetailsV1(
  event: DALinV1SetAuctionDetails
): void {
  handleDALinSetAuctionDetailsGeneric(event);
}
export function handleDALinSetAuctionDetailsV2(
  event: DALinV2SetAuctionDetails
): void {
  handleDALinSetAuctionDetailsGeneric(event);
}

export function handleDALinSetAuctionDetailsGeneric<T>(event: T): void {
  if (
    !(
      event instanceof DALinV0SetAuctionDetails ||
      event instanceof DALinV1SetAuctionDetails ||
      event instanceof DALinV2SetAuctionDetails
    )
  ) {
    return;
  }

  let minterProjectAndConfig = loadMinterProjectAndConfig(
    event.address,
    event.params.projectId,
    event.block.timestamp
  );

  if (minterProjectAndConfig) {
    let projectMinterConfig = minterProjectAndConfig.projectMinterConfiguration;
    let project = minterProjectAndConfig.project;

    projectMinterConfig.basePrice = event.params._basePrice;
    projectMinterConfig.startPrice = event.params._startPrice;
    projectMinterConfig.startTime = event.params._auctionTimestampStart;
    projectMinterConfig.endTime = event.params._auctionTimestampEnd;
    projectMinterConfig.priceIsConfigured = true;

    projectMinterConfig.save();

    project.updatedAt = event.block.timestamp;
    project.save();
  }
}

export function handleDALinResetAuctionDetailsV0(
  event: DALinV0ResetAuctionDetails
): void {
  handleDALinResetAuctionDetailsGeneric(event);
}
export function handleDALinResetAuctionDetailsV1(
  event: DALinV1ResetAuctionDetails
): void {
  handleDALinResetAuctionDetailsGeneric(event);
}
export function handleDALinResetAuctionDetailsV2(
  event: DALinV2ResetAuctionDetails
): void {
  handleDALinResetAuctionDetailsGeneric(event);
}

export function handleDALinResetAuctionDetailsGeneric<T>(event: T): void {
  if (
    !(
      event instanceof DALinV0ResetAuctionDetails ||
      event instanceof DALinV1ResetAuctionDetails ||
      event instanceof DALinV2ResetAuctionDetails
    )
  ) {
    return;
  }

  let minterProjectAndConfig = loadMinterProjectAndConfig(
    event.address,
    event.params.projectId,
    event.block.timestamp
  );

  if (minterProjectAndConfig) {
    let projectMinterConfig = minterProjectAndConfig.projectMinterConfiguration;
    let project = minterProjectAndConfig.project;

    projectMinterConfig.basePrice = null;
    projectMinterConfig.startPrice = null;
    projectMinterConfig.startTime = null;
    projectMinterConfig.endTime = null;
    projectMinterConfig.priceIsConfigured = false;

    projectMinterConfig.save();

    project.updatedAt = event.block.timestamp;
    project.save();
  }
}

export function handleAuctionHalfLifeRangeSecondsUpdatedV0(
  event: AuctionHalfLifeRangeSecondsUpdatedV0
): void {
  handleAuctionHalfLifeRangeSecondsUpdatedGeneric(event);
}
export function handleAuctionHalfLifeRangeSecondsUpdatedV1(
  event: AuctionHalfLifeRangeSecondsUpdatedV1
): void {
  handleAuctionHalfLifeRangeSecondsUpdatedGeneric(event);
}
export function handleAuctionHalfLifeRangeSecondsUpdatedV2(
  event: AuctionHalfLifeRangeSecondsUpdatedV2
): void {
  handleAuctionHalfLifeRangeSecondsUpdatedGeneric(event);
}
export function handleAuctionHalfLifeRangeSecondsUpdatedRefund(
  event: AuctionHalfLifeRangeSecondsUpdatedRefund
): void {
  handleAuctionHalfLifeRangeSecondsUpdatedGeneric(event);
}

// MinterDAExp events
export function handleAuctionHalfLifeRangeSecondsUpdatedGeneric<T>(
  event: T
): void {
  if (
    !(
      event instanceof AuctionHalfLifeRangeSecondsUpdatedV0 ||
      event instanceof AuctionHalfLifeRangeSecondsUpdatedV1 ||
      event instanceof AuctionHalfLifeRangeSecondsUpdatedV2 ||
      event instanceof AuctionHalfLifeRangeSecondsUpdatedRefund
    )
  ) {
    return;
  }

  let minter = loadOrCreateMinter(event.address, event.block.timestamp);

  minter.minimumHalfLifeInSeconds =
    event.params._minimumPriceDecayHalfLifeSeconds;
  minter.maximumHalfLifeInSeconds =
    event.params._maximumPriceDecayHalfLifeSeconds;

  minter.updatedAt = event.block.timestamp;
  minter.save();
}

export function handleDAExpSetAuctionDetailsV0(
  event: DAExpV0SetAuctionDetails
): void {
  handleDAExpSetAuctionDetailsGeneric(event);
}
export function handleDAExpSetAuctionDetailsV1(
  event: DAExpV1SetAuctionDetails
): void {
  handleDAExpSetAuctionDetailsGeneric(event);
}
export function handleDAExpSetAuctionDetailsV2(
  event: DAExpV2SetAuctionDetails
): void {
  handleDAExpSetAuctionDetailsGeneric(event);
}
export function handleDAExpRefundSetAuctionDetails(
  event: DAExpRefundSetAuctionDetails
): void {
  handleDAExpSetAuctionDetailsGeneric(event);
}

export function handleDAExpSetAuctionDetailsGeneric<T>(event: T): void {
  if (
    !(
      event instanceof DAExpV0SetAuctionDetails ||
      event instanceof DAExpV1SetAuctionDetails ||
      event instanceof DAExpV2SetAuctionDetails ||
      event instanceof DAExpRefundSetAuctionDetails
    )
  ) {
    return;
  }

  let minterProjectAndConfig = loadMinterProjectAndConfig(
    event.address,
    event.params.projectId,
    event.block.timestamp
  );

  if (minterProjectAndConfig) {
    let projectMinterConfig = minterProjectAndConfig.projectMinterConfiguration;
    let project = minterProjectAndConfig.project;

    projectMinterConfig.basePrice = event.params._basePrice;
    projectMinterConfig.startPrice = event.params._startPrice;
    projectMinterConfig.startTime = event.params._auctionTimestampStart;
    projectMinterConfig.halfLifeSeconds =
      event.params._priceDecayHalfLifeSeconds;
    projectMinterConfig.priceIsConfigured = true;

    projectMinterConfig.save();

    project.updatedAt = event.block.timestamp;
    project.save();
  }
}

export function handleDAExpResetAuctionDetailsV0(
  event: DAExpV0ResetAuctionDetails
): void {
  handleDAExpResetAuctionDetailsGeneric(event);
}
export function handleDAExpResetAuctionDetailsV1(
  event: DAExpV1ResetAuctionDetails
): void {
  handleDAExpResetAuctionDetailsGeneric(event);
}
export function handleDAExpResetAuctionDetailsV2(
  event: DAExpV2ResetAuctionDetails
): void {
  handleDAExpResetAuctionDetailsGeneric(event);
}
export function handleDAExpRefundResetAuctionDetails(
  event: DAExpRefundResetAuctionDetails
): void {
  handleDAExpResetAuctionDetailsGeneric(event);
}

export function handleDAExpResetAuctionDetailsGeneric<T>(event: T): void {
  if (
    !(
      event instanceof DAExpV0ResetAuctionDetails ||
      event instanceof DAExpV1ResetAuctionDetails ||
      event instanceof DAExpV2ResetAuctionDetails ||
      event instanceof DAExpRefundResetAuctionDetails
    )
  ) {
    return;
  }

  let minterProjectAndConfig = loadMinterProjectAndConfig(
    event.address,
    event.params.projectId,
    event.block.timestamp
  );

  if (minterProjectAndConfig) {
    let projectMinterConfig = minterProjectAndConfig.projectMinterConfiguration;
    let project = minterProjectAndConfig.project;

    projectMinterConfig.basePrice = null;
    projectMinterConfig.startPrice = null;
    projectMinterConfig.startTime = null;
    projectMinterConfig.halfLifeSeconds = null;
    projectMinterConfig.priceIsConfigured = false;

    projectMinterConfig.save();

    project.updatedAt = event.block.timestamp;
    project.save();
  }
}

// MinterHolder Specific Handlers

export function handleAllowHoldersOfProjectsV0(
  event: MinterHolderV0AllowedHoldersOfProjects
): void {
  handleHoldersOfProjectsGeneric(event);
}
export function handleAllowHoldersOfProjectsV1(
  event: MinterHolderV1AllowedHoldersOfProjects
): void {
  handleHoldersOfProjectsGeneric(event);
}

export function handleRemoveHoldersOfProjectsV0(
  event: MinterHolderV0RemovedHoldersOfProjects
): void {
  handleHoldersOfProjectsGeneric(event);
}
export function handleRemoveHoldersOfProjectsV1(
  event: MinterHolderV1RemovedHoldersOfProjects
): void {
  handleHoldersOfProjectsGeneric(event);
}

export function handleHoldersOfProjectsGeneric<T>(event: T): void {
  if (
    !(
      event instanceof MinterHolderV0AllowedHoldersOfProjects ||
      event instanceof MinterHolderV0RemovedHoldersOfProjects ||
      event instanceof MinterHolderV1AllowedHoldersOfProjects ||
      event instanceof MinterHolderV1RemovedHoldersOfProjects
    )
  ) {
    return;
  }
  for (let i = 0; i < event.params._ownedNFTAddresses.length; i++) {
    let address = event.params._ownedNFTAddresses[i].toHexString();
    let holderProjectId = event.params._ownedNFTProjectIds[i].toString();
    let bytesValueCombined = Bytes.fromUTF8(address + "-" + holderProjectId);

    let newAddEvent: ConfigValueAddedToSetBytes;
    let newRemoveEvent: ConfigValueRemovedFromSetBytes;
    const parameters = [
      new ethereum.EventParam(
        "_projectId",
        ethereum.Value.fromUnsignedBigInt(event.params._projectId)
      ),
      new ethereum.EventParam(
        "_key",
        ethereum.Value.fromBytes(
          Bytes.fromUTF8("allowlistedAddressAndProjectId")
        )
      ),
      new ethereum.EventParam(
        "_value",
        ethereum.Value.fromBytes(bytesValueCombined)
      )
    ];
    if (
      event instanceof MinterHolderV0AllowedHoldersOfProjects ||
      event instanceof MinterHolderV1AllowedHoldersOfProjects
    ) {
      newAddEvent = new ConfigValueAddedToSetBytes(
        event.address,
        event.logIndex,
        event.transactionLogIndex,
        event.logType,
        event.block,
        event.transaction,
        parameters,
        event.receipt
      );
      handleAddManyBytesValueProjectConfig(newAddEvent);
    } else if (
      event instanceof MinterHolderV0RemovedHoldersOfProjects ||
      event instanceof MinterHolderV1RemovedHoldersOfProjects
    ) {
      newRemoveEvent = new ConfigValueRemovedFromSetBytes(
        event.address,
        event.logIndex,
        event.transactionLogIndex,
        event.logType,
        event.block,
        event.transaction,
        parameters,
        event.receipt
      );
      handleRemoveBytesManyValueProjectConfig(newRemoveEvent);
    }
  }
}

export function handleRegistrationNFTAddresses<T>(event: T): void {
  if (
    !(
      event instanceof MinterHolderV0RegisteredNFTAddress ||
      event instanceof MinterHolderV1RegisteredNFTAddress ||
      event instanceof MinterHolderV0UnregisteredNFTAddress ||
      event instanceof MinterHolderV1UnregisteredNFTAddress
    )
  ) {
    return;
  }

  let genericEvent: MinterConfigSetAddressEvent;
  genericEvent = changetype<MinterConfigSetAddressEvent>(event);

  genericEvent.parameters = [
    new ethereum.EventParam(
      "_key",
      ethereum.Value.fromBytes(Bytes.fromUTF8("registeredNFTAddresses"))
    ),
    new ethereum.EventParam(
      "_value",
      ethereum.Value.fromAddress(event.params._NFTAddress)
    )
  ];

  if (
    event instanceof MinterHolderV0RegisteredNFTAddress ||
    event instanceof MinterHolderV1RegisteredNFTAddress
  ) {
    handleAddManyAddressValueMinterConfig(genericEvent);
  } else if (
    event instanceof MinterHolderV0UnregisteredNFTAddress ||
    event instanceof MinterHolderV1UnregisteredNFTAddress
  ) {
    handleRemoveAddressManyValueMinterConfig(genericEvent);
  }
}

export function handleRegisteredNFTAddressV0(
  event: MinterHolderV0RegisteredNFTAddress
): void {
  handleRegistrationNFTAddresses(event);
}
export function handleRegisteredNFTAddressV1(
  event: MinterHolderV1RegisteredNFTAddress
): void {
  handleRegistrationNFTAddresses(event);
}

export function handleUnregisteredNFTAddressV0(
  event: MinterHolderV0UnregisteredNFTAddress
): void {
  handleRegistrationNFTAddresses(event);
}
export function handleUnregisteredNFTAddressV1(
  event: MinterHolderV1UnregisteredNFTAddress
): void {
  handleRegistrationNFTAddresses(event);
}

// Generic Handlers
// Below is all logic pertaining to generic handlers used for maintaining JSON config stores on both the ProjectMinterConfiguration and Minter entities.
// Most logic is shared and bubbled up each respective handler for each action. We utilize ducktype to allow these to work on either a Minter or ProjectMinterConfiguration
// Because AssemblyScript does not support union types, we need to manually type check inside each method, to ensure correct usage.
// For any questions reach out to @jon or @ryley-o.eth. or see the following document https://docs.google.com/document/d/1XSxl04eJyTxc_rbj6cmq-j00zaYDzApBBLT67JXtaOw/edit?disco=AAAAZa8xp-Q

export function handleSetValueGeneric<T, C>(
  event: T,
  config: C,
  project: Project | null
): void {
  if (
    !(
      event instanceof ConfigValueSetBool ||
      event instanceof ConfigValueSetBigInt ||
      event instanceof ConfigValueSetAddress ||
      event instanceof ConfigValueSetBytes
    )
  ) {
    return;
  }

  if (
    !(config instanceof ProjectMinterConfiguration || config instanceof Minter)
  ) {
    return;
  }

  if (project) {
    project.updatedAt = event.block.timestamp;
  }

  let minterDetails = getMinterDetails(config);
  let jsonKey = event.params._key.toString();
  let jsonValue: JSONValue;

  if (event instanceof ConfigValueSetBool) {
    jsonValue = json.fromString(booleanToString(event.params._value));
  } else if (event instanceof ConfigValueSetBigInt) {
    jsonValue = json.fromString(event.params._value.toString());
  } else if (event instanceof ConfigValueSetAddress) {
    jsonValue = stringToJSONValue(event.params._value.toHexString());
  } else if (event instanceof ConfigValueSetBytes) {
    jsonValue = bytesToJSONValue(event.params._value);
  }

  minterDetails.set(jsonKey, jsonValue);

  config.extraMinterDetails = typedMapToJSONString(minterDetails);

  config.save();
  if (project) {
    project.save();
  }
}

export function handleSetValueProjectConfig<T>(event: T): void {
  if (
    !(
      event instanceof ConfigValueSetBool ||
      event instanceof ConfigValueSetBigInt ||
      event instanceof ConfigValueSetAddress ||
      event instanceof ConfigValueSetBytes
    )
  ) {
    return;
  }
  let minterProjectAndConfig = loadMinterProjectAndConfig(
    event.address,
    event.params._projectId,
    event.block.timestamp
  );
  if (minterProjectAndConfig) {
    handleSetValueGeneric(
      event,
      minterProjectAndConfig.projectMinterConfiguration,
      minterProjectAndConfig.project
    );
  }
}
export function handleSetBooleanValueProjectConfig(
  event: ConfigValueSetBool
): void {
  handleSetValueProjectConfig(event);
}

export function handleSetBigIntValueProjectConfig(
  event: ConfigValueSetBigInt
): void {
  handleSetValueProjectConfig(event);
}

export function handleSetAddressValueProjectConfig(
  event: ConfigValueSetAddress
): void {
  handleSetValueProjectConfig(event);
}

export function handleSetBytesValueProjectConfig(
  event: ConfigValueSetBytes
): void {
  handleSetValueProjectConfig(event);
}

export function handleRemoveValueGeneric<T>(
  event: ConfigKeyRemoved,
  config: T,
  project: Project | null
): void {
  if (
    !(config instanceof ProjectMinterConfiguration || config instanceof Minter)
  ) {
    return;
  }

  if (project) {
    project.updatedAt = event.block.timestamp;
  }

  let minterDetails = getMinterDetails(config);

  const withRemovedTypedMap: TypedMap<string, JSONValue> = new TypedMap();
  let keyToToRemove = event.params._key.toString();

  for (let i = 0; i < minterDetails.entries.length; i++) {
    let entry = minterDetails.entries[i];
    if (entry.key != keyToToRemove) {
      withRemovedTypedMap.set(entry.key, entry.value);
    }
  }

  config.extraMinterDetails = typedMapToJSONString(withRemovedTypedMap);

  if (project) {
    project.save();
  }
  config.save();
}

export function handleRemoveValueProjectConfig(event: ConfigKeyRemoved): void {
  let minterProjectAndConfig = loadMinterProjectAndConfig(
    event.address,
    event.params._projectId,
    event.block.timestamp
  );
  if (minterProjectAndConfig) {
    handleRemoveValueGeneric(
      event,
      minterProjectAndConfig.projectMinterConfiguration,
      minterProjectAndConfig.project
    );
  }
}

export function handleAddManyValueGeneric<T, C>(
  event: T,
  config: C,
  project: Project | null
): void {
  if (
    !(
      event instanceof ConfigValueAddedToSetBigInt ||
      event instanceof ConfigValueAddedToSetAddress ||
      event instanceof ConfigValueAddedToSetBytes ||
      event instanceof MinterConfigSetAddressEvent
    )
  ) {
    return;
  }
  if (
    !(config instanceof ProjectMinterConfiguration || config instanceof Minter)
  ) {
    return;
  }

  if (project) {
    project.updatedAt = event.block.timestamp;
  }
  let jsonResult = json.try_fromString(config.extraMinterDetails);

  let minterDetails: TypedMap<string, JSONValue>;

  if (jsonResult.isOk && jsonResult.value.kind == JSONValueKind.OBJECT) {
    minterDetails = jsonResult.value.toObject();
  } else {
    minterDetails = new TypedMap();
  }

  let val = minterDetails.get(event.params._key.toString());
  let newValue: JSONValue;

  if (event instanceof ConfigValueAddedToSetBigInt) {
    let arr: BigInt[] = [];
    if (val) {
      arr = val.toArray().map<BigInt>((v: JSONValue) => v.toBigInt());
    }
    // only add if it doesn't exist, so we act like a Set
    if (!arr.includes(event.params._value)) {
      arr.push(event.params._value);
    }
    newValue = arrayToJSONValue(arr.toString());
  } else if (
    event instanceof ConfigValueAddedToSetAddress ||
    event instanceof ConfigValueAddedToSetBytes ||
    event instanceof MinterConfigSetAddressEvent
  ) {
    let arr: string[] = [];
    if (val) {
      arr = val
        .toArray()
        .map<string>((v: JSONValue) => stringToJSONString(v.toString()));
    }
    let stringVal: string;
    if (
      event instanceof ConfigValueAddedToSetAddress ||
      event instanceof MinterConfigSetAddressEvent
    ) {
      stringVal = event.params._value.toHexString();
    } else {
      // for Bytes, use method to determine if string or hexString
      stringVal = bytesToJSONValue(event.params._value).toString();
    }
    // only add if it doesn't exist, so we act like a Set
    if (!arr.includes(stringVal)) {
      arr.push(stringToJSONString(stringVal));
    }
    newValue = arrayToJSONValue(arr.toString());
  }

  minterDetails.set(event.params._key.toString(), newValue);
  config.extraMinterDetails = typedMapToJSONString(minterDetails);

  if (project) {
    project.save();
  }
  config.save();
}

export function handleAddManyProjectConfig<T>(event: T): void {
  if (
    !(
      event instanceof ConfigValueAddedToSetBigInt ||
      event instanceof ConfigValueAddedToSetAddress ||
      event instanceof ConfigValueAddedToSetBytes
    )
  ) {
    return;
  }
  let minterProjectAndConfig = loadMinterProjectAndConfig(
    event.address,
    event.params._projectId,
    event.block.timestamp
  );
  if (minterProjectAndConfig) {
    handleAddManyValueGeneric(
      event,
      minterProjectAndConfig.projectMinterConfiguration,
      minterProjectAndConfig.project
    );
  }
}

export function handleAddManyMinterConfig<T>(event: T): void {
  if (!(event instanceof MinterConfigSetAddressEvent)) {
    return;
  }

  let minter = loadOrCreateMinter(event.address, event.block.timestamp);
  if (minter) {
    handleAddManyValueGeneric(event, minter, null);
  }
}

export function handleAddManyBigIntValueProjectConfig(
  event: ConfigValueAddedToSetBigInt
): void {
  handleAddManyProjectConfig(event);
}

export function handleAddManyAddressValueProjectConfig(
  event: ConfigValueAddedToSetAddress
): void {
  handleAddManyProjectConfig(event);
}

export function handleAddManyBytesValueProjectConfig(
  event: ConfigValueAddedToSetBytes
): void {
  handleAddManyProjectConfig(event);
}

export function handleAddManyAddressValueMinterConfig(
  event: MinterConfigSetAddressEvent
): void {
  handleAddManyMinterConfig(event);
}

export function handleRemoveManyValueGeneric<T, C>(
  event: T,
  config: C,
  project: Project | null
): void {
  if (
    !(
      event instanceof ConfigValueRemovedFromSetBigInt ||
      event instanceof ConfigValueRemovedFromSetAddress ||
      event instanceof ConfigValueRemovedFromSetBytes ||
      event instanceof MinterConfigSetAddressEvent
    )
  ) {
    return;
  }

  if (
    !(config instanceof ProjectMinterConfiguration || config instanceof Minter)
  ) {
    return;
  }

  if (project) {
    project.updatedAt = event.block.timestamp;
  }
  let minterDetails = getMinterDetails(config);
  let jsonArr = minterDetails.get(event.params._key.toString());
  let newValue: JSONValue;
  if (event instanceof ConfigValueRemovedFromSetBigInt) {
    let arrWithRemoved: BigInt[] = [];
    if (jsonArr) {
      let arr = jsonArr.toArray().map<BigInt>((v: JSONValue) => {
        return v.toBigInt();
      });
      for (let i = 0; i < arr.length; i++) {
        let entry = arr[i];
        if (entry != event.params._value) {
          arrWithRemoved.push(entry);
        }
      }
    }
    newValue = arrayToJSONValue(arrWithRemoved.toString());
  } else if (
    event instanceof ConfigValueRemovedFromSetAddress ||
    event instanceof ConfigValueRemovedFromSetBytes ||
    event instanceof MinterConfigSetAddressEvent
  ) {
    let arrWithRemoved: string[] = [];
    if (jsonArr) {
      let arr = jsonArr.toArray().map<string>((v: JSONValue) => {
        return v.toString();
      });
      for (let i = 0; i < arr.length; i++) {
        let entry = arr[i];
        let paramsVal: string = "";
        if (
          event instanceof ConfigValueRemovedFromSetAddress ||
          event instanceof MinterConfigSetAddressEvent
        ) {
          paramsVal = event.params._value.toHexString();
        }
        if (event instanceof ConfigValueRemovedFromSetBytes) {
          paramsVal = event.params._value.toString();
        }
        if (entry != paramsVal) {
          arrWithRemoved.push(stringToJSONString(entry));
        }
      }
    }
    newValue = arrayToJSONValue(arrWithRemoved.toString());
  }

  minterDetails.set(event.params._key.toString(), newValue);

  config.extraMinterDetails = typedMapToJSONString(minterDetails);

  if (project) {
    project.save();
  }
  config.save();
}

export function handleRemoveManyProjectConfig<T>(event: T): void {
  if (
    !(
      event instanceof ConfigValueRemovedFromSetBigInt ||
      event instanceof ConfigValueRemovedFromSetAddress ||
      event instanceof ConfigValueRemovedFromSetBytes
    )
  ) {
    return;
  }
  let minterProjectAndConfig = loadMinterProjectAndConfig(
    event.address,
    event.params._projectId,
    event.block.timestamp
  );
  if (minterProjectAndConfig) {
    handleRemoveManyValueGeneric(
      event,
      minterProjectAndConfig.projectMinterConfiguration,
      minterProjectAndConfig.project
    );
  }
}

export function handleRemoveManyMinterConfig<T>(event: T): void {
  if (!(event instanceof MinterConfigSetAddressEvent)) {
    return;
  }
  let minter = loadOrCreateMinter(event.address, event.block.timestamp);
  if (minter) {
    handleRemoveManyValueGeneric(event, minter, null);
  }
}

export function handleRemoveBigIntManyValueProjectConfig(
  event: ConfigValueRemovedFromSetBigInt
): void {
  handleRemoveManyProjectConfig(event);
}

export function handleRemoveAddressManyValueProjectConfig(
  event: ConfigValueRemovedFromSetAddress
): void {
  handleRemoveManyProjectConfig(event);
}
export function handleRemoveBytesManyValueProjectConfig(
  event: ConfigValueRemovedFromSetBytes
): void {
  handleRemoveManyProjectConfig(event);
}

export function handleRemoveAddressManyValueMinterConfig(
  event: MinterConfigSetAddressEvent
): void {
  handleRemoveManyMinterConfig(event);
}

export function handleReceiptUpdated(event: ReceiptUpdated): void {
  let minter = loadOrCreateMinter(event.address, event.block.timestamp);
  if (minter) {
    // load or create receipt
    let projectId = generateContractSpecificId(
      Address.fromString(minter.coreContract),
      event.params._projectId
    );
    let receipt: Receipt = loadOrCreateReceipt(
      minter.id,
      projectId,
      event.params._purchaser
    );
    if (receipt) {
      // update receipt state
      receipt.netPaid = event.params._netPaid;
      receipt.numPurchased = event.params._numPurchased;
      receipt.save();
      // additionally, sync latest purchase price and number of refundable
      // purchases for project on this minter
      // @dev this is because this can be the only event emitted from the
      // minter during a purchase on a refundable minter
      syncLatestPurchasePrice(event.address, event.params._projectId, event);
      syncNumRefundableInvocations(
        event.address,
        event.params._projectId,
        event
      );
    } else {
      log.warning(
        "Error while loading/creating receipt in tx {}, log index {}",
        [
          event.transaction.hash.toHexString(),
          event.transactionLogIndex.toString()
        ]
      );
    }
  } else {
    log.warning("Error while loading/creating minter with id {}", [
      event.address.toHexString()
    ]);
  }
}

export function handleSelloutPriceUpdated(event: SelloutPriceUpdated): void {
  syncLatestPurchasePrice(event.address, event.params._projectId, event);
}

export function handleArtistAndAdminRevenuesWithdrawn(
  event: ArtistAndAdminRevenuesWithdrawn
): void {
  // the function that emits this event can affect latest purchase price, so sync it
  syncLatestPurchasePrice(event.address, event.params._projectId, event);
  // update project extra minter details key `auctionRevenuesCollected` to true
  let genericEvent: ConfigValueSetBool;
  genericEvent = changetype<ConfigValueSetBool>(event);
  genericEvent.parameters = [
    new ethereum.EventParam(
      "_projectId",
      ethereum.Value.fromUnsignedBigInt(event.params._projectId)
    ),
    new ethereum.EventParam(
      "_key",
      ethereum.Value.fromBytes(Bytes.fromUTF8("refundableNetPrice"))
    ),
    new ethereum.EventParam("_value", ethereum.Value.fromBoolean(true))
  ];
  // call generic handler to populate project's extraMinterDetails
  handleSetValueProjectConfig(genericEvent);
}

// Helpers
/**
 * @notice Syncs a (refundable) minter's project latest purchase price in
 * extraMinterDetails to the current value on the minter.
 * @param minterAddress minter address to by synced
 * @param projectId project id to sync (big int, not contract specific id)
 * @param event The event emitted from the minter that triggered this sync
 */
function syncLatestPurchasePrice(
  minterAddress: Address,
  projectId: BigInt,
  event: ethereum.Event
): void {
  let refundableMinter = IFilteredMinterDAExpRefundV0.bind(minterAddress);
  let latestPurchasePrice = refundableMinter.getProjectLatestPurchasePrice(
    projectId
  );
  // update extraMinterDetails key `refundableNetPrice` to be latestPurchasePrice
  let genericEvent: ConfigValueSetBigInt = new ConfigValueSetBigInt(
    event.address,
    event.logIndex,
    event.transactionLogIndex,
    event.logType,
    event.block,
    event.transaction,
    [],
    event.receipt
  );
  genericEvent.parameters = [
    new ethereum.EventParam(
      "_projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    ),
    new ethereum.EventParam(
      "_key",
      ethereum.Value.fromBytes(Bytes.fromUTF8("refundableNetPrice"))
    ),
    new ethereum.EventParam(
      "_value",
      ethereum.Value.fromUnsignedBigInt(latestPurchasePrice)
    )
  ];
  // call generic handler to populate project's extraMinterDetails
  handleSetValueProjectConfig(genericEvent);
}

/**
 * @notice Syncs a (refundable) minter's project number of refundable
 * invocations in extraMinterDetails to the current value on the minter.
 * @param minterAddress minter address to by synced
 * @param projectId project id to sync (big int, not contract specific id)
 * @param event The event emitted from the minter that triggered this sync
 */
function syncNumRefundableInvocations(
  minterAddress: Address,
  projectId: BigInt,
  event: ethereum.Event
): void {
  let refundableMinter = IFilteredMinterDAExpRefundV0.bind(minterAddress);
  let numRefundableInvocations = refundableMinter.getNumRefundableInvocations(
    projectId
  );
  // update extraMinterDetails key `numRefundableInvocations` to be numRefundableInvocations
  let genericEvent: ConfigValueSetBigInt = new ConfigValueSetBigInt(
    event.address,
    event.logIndex,
    event.transactionLogIndex,
    event.logType,
    event.block,
    event.transaction,
    [],
    event.receipt
  );
  genericEvent.parameters = [
    new ethereum.EventParam(
      "_projectId",
      ethereum.Value.fromUnsignedBigInt(projectId)
    ),
    new ethereum.EventParam(
      "_key",
      ethereum.Value.fromBytes(Bytes.fromUTF8("numRefundableInvocations"))
    ),
    new ethereum.EventParam(
      "_value",
      ethereum.Value.fromUnsignedBigInt(numRefundableInvocations)
    )
  ];
  // call generic handler to populate project's extraMinterDetails
  handleSetValueProjectConfig(genericEvent);
}

class MinterProjectAndConfig {
  minter: Minter;
  project: Project;
  projectMinterConfiguration: ProjectMinterConfiguration;
}

function loadMinterProjectAndConfig(
  minterAddress: Address,
  projectId: BigInt,
  timestamp: BigInt
): MinterProjectAndConfig | null {
  let minter = loadOrCreateMinter(minterAddress, timestamp);

  let project = Project.load(
    generateContractSpecificId(
      Address.fromString(minter.coreContract),
      projectId
    )
  );
  if (!project) {
    return null;
  }

  let projectMinterConfig = ProjectMinterConfiguration.load(
    getProjectMinterConfigId(minter.id, project.id)
  );
  if (!projectMinterConfig) {
    projectMinterConfig = new ProjectMinterConfiguration(
      getProjectMinterConfigId(minter.id, project.id)
    );
    projectMinterConfig.project = project.id;
    projectMinterConfig.minter = minterAddress.toHexString();
    projectMinterConfig.priceIsConfigured = false;
    projectMinterConfig.currencySymbol = "ETH";
    projectMinterConfig.currencyAddress = Address.zero();
    projectMinterConfig.purchaseToDisabled = false;
    projectMinterConfig.extraMinterDetails = "{}";
    projectMinterConfig.save();
  }

  return {
    minter: minter,
    project: project,
    projectMinterConfiguration: projectMinterConfig
  };
}
