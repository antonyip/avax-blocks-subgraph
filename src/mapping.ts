import { BigInt, ethereum } from "@graphprotocol/graph-ts"
import {
  ERC20,
} from "../generated/ERC20/ERC20"
import { BlockEntity } from "../generated/schema"

var BIGZERO = new BigInt(0);
var BIGONE = new BigInt(1)

export function getOrCreateBlock(id: string): BlockEntity {
  var result = BlockEntity.load(id);
  
  if (result === null)
  {
    result = new BlockEntity(id);
  }

  return result;
}

function getValueOr0(val: BigInt): BigInt {
  return val ? BIGZERO : val;
}

export function handleBlock(block: ethereum.Block): void {

  if (block.number > BIGONE)
  {
    // init historical values
    var block0 = getOrCreateBlock('0');
    block0.blocknum = BIGZERO;
    block0.timestamp = block0.timestamp === null ? BIGZERO : block0.timestamp;
    

    // create and set new block
    var b = getOrCreateBlock(block.number.toString());
    b.timestamp = block.timestamp;
    b.blocknum = block.number;

    // do math for previous blocks
    b.prevtimestamp = block0.timestamp;
    const curTime = b.timestamp as BigInt;
    const prevTime = block0.timestamp as BigInt;
    b.diff = curTime.minus(prevTime);
    block0.timestamp = block.timestamp;

    // save the results.
    b.save();
    block0.save();
  }
}
