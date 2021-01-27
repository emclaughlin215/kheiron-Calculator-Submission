import { MenuItem } from '@blueprintjs/core';
import { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import React from 'react';


export interface IMode {
    type: string;
    display: string;
}

export const renderMode: ItemRenderer<IMode> = (mode, { handleClick, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }
    const text = mode.display;
    return (    
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={mode.type}
            onClick={handleClick}
            text={highlightText(text, query)}
        />
    );
};


export const filterMode: ItemPredicate<IMode> = (query, mode, _index, exactMatch) => {
    const normalizedName = mode.display.toLowerCase();
    const normalizedQuery = query.toLowerCase();
  
    if (exactMatch) {
        return normalizedName === normalizedQuery;
    } else {
        return `${normalizedName}`.indexOf(normalizedQuery) >= 0;
    }
  };


  function escapeRegExpChars(text: string) {
    return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
  }
  
  function highlightText(text: string, query: string) {
    let lastIndex = 0;
    const words = query
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(escapeRegExpChars);
    if (words.length === 0) {
        return [text];
    }
    const regexp = new RegExp(words.join("|"), "gi");
    const tokens: React.ReactNode[] = [];
    while (true) {
        const match = regexp.exec(text);
        if (!match) {
            break;
        }
        const length = match[0].length;
        const before = text.slice(lastIndex, regexp.lastIndex - length);
        if (before.length > 0) {
            tokens.push(before);
        }
        lastIndex = regexp.lastIndex;
        tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
    }
    const rest = text.slice(lastIndex);
    if (rest.length > 0) {
        tokens.push(rest);
    }
    return tokens;
  }
  