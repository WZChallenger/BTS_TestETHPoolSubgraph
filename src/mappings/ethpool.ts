/* eslint-disable prefer-const */ // to satisfy AS compiler
import { Address, BigDecimal } from '@graphprotocol/graph-ts';
import { Deposit, ETHPool } from '../types/ETHPool/ETHPool';
import { Account } from '../types/schema';

export function handleDeposit(event: Deposit): void {
  let address = event.address.toHexString();
  let account = Account.load(address);
  if (account == null) {
    account = new Account(address)
    account.totalDeposit = BigDecimal.fromString('0');
    account.pendingRewards = BigDecimal.fromString('0');
  }
  
  let ethPool = ETHPool.bind(Address.fromString('0xE71565Db15f68b4cf36d576e5F9Bc8eF0F56B30f'));
  let pendingRewards = ethPool.getRewards(event.address);
  account.pendingRewards = pendingRewards.toBigDecimal();
  account.totalDeposit = account.totalDeposit.plus(event.params._value.toBigDecimal());
  account.save();
}
