import { ArrowDown } from './ArrowDown';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { testCoins } from '@/temp';
import { useClickOutside } from '@/hooks';
import { Currency } from '@/types';

export type CurrencySelectProps = {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onAmountChange: (amount: number) => void;
  id?: string;
  name?: string;
  coins?: Currency[];
  minAmount?: number;
};

export const CurrencySelect = ({
  selectedCurrency,
  onCurrencyChange,
  onAmountChange,
  id,
  name,
  coins = testCoins,
  minAmount = 0,
}: CurrencySelectProps) => {
  const [amount, setAmount] = useState(String(minAmount));
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useClickOutside<HTMLInputElement>(() => {
    setIsOpen(false);
    setSearch('');
  });

  useEffect(() => {
    setAmount(String(minAmount));
  }, [minAmount, selectedCurrency]);

  const filteredCoins = coins.filter(
    coin =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.ticker.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOpen) {
      setAmount(e.target.value);
      onAmountChange(Number.parseFloat(e.target.value));
    } else {
      setSearch(e.target.value);
    }
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
    inputRef.current?.focus();
  };

  const handleSelect = (currency: Currency) => {
    onCurrencyChange(currency);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className='relative w-full'>
      <div
        className={cn(
          'flex rounded-[5px] border border-[#e3ebef] bg-[#f6f7f8]',
          {
            'rounded-ee-none rounded-es-none border-l-[#c1d9e5] border-r-[#c1d9e5] border-t-[#c1d9e5]':
              isOpen,
          }
        )}
      >
        <input
          id={id}
          name={name}
          value={!isOpen ? amount : search}
          onChange={handleChange}
          ref={inputRef}
          type={isOpen ? 'text' : 'number'}
          min={0}
          className='w-full bg-transparent px-4 pb-[13px] pt-[14px] text-base font-normal leading-[23px] text-dark-gray outline-none'
        />
        {!isOpen && (
          <div
            onClick={handleClick}
            className='relative flex w-[150px] shrink-0 cursor-pointer items-center py-[13px] pl-[34px] pr-2 before:absolute before:left-0 before:h-[calc(100%-20px)] before:w-[1px] before:bg-[#e3ebef] before:content-[""]'
          >
            <img
              src={selectedCurrency.image}
              alt={selectedCurrency.name}
              width={20}
              height={20}
            />
            <div className='ml-3 mr-[30px] text-base font-normal leading-[23px]'>
              {selectedCurrency.ticker.toUpperCase()}
            </div>
            <ArrowDown />
          </div>
        )}
      </div>

      {isOpen && (
        <ul className='absolute z-10 max-h-[300px] w-full overflow-hidden overflow-y-auto rounded-bl-[5px] rounded-br-[5px] border border-[#c1d9e5] border-t-transparent bg-[#f6f7f8]'>
          {filteredCoins.map(coin => (
            <li
              key={coin.ticker}
              className='flex cursor-pointer items-center px-4 py-3 hover:bg-[#eaf1f7]'
              title={coin.name}
              onClick={() => handleSelect(coin)}
            >
              <img src={coin.image} alt={coin.name} width={20} height={20} />
              <div className='ml-3 mr-4 text-base font-normal uppercase leading-[23px] text-dark-gray'>
                {coin.ticker}
              </div>
              <div className='truncate text-base font-normal leading-[23px] text-[#80a2b6]'>
                {coin.name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};