import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import styles from "./CustomSelect.module.css";

const CustomSelect = ({
    label,
    name,
    value,
    options,
    onChange,
    error,
    placeholder = "Choose",
    className = "",
    isMulti = false
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef(null);

    // Normalize options to handle both array of strings/numbers and array of objects
    const normalizedOptions = options.map(opt => {
        if (typeof opt === "object" && opt !== null) return opt;
        return { value: opt, label: String(opt) };
    });

    const getSelectedLabels = () => {
        if (isMulti) {
            const values = Array.isArray(value) ? value : [];
            return normalizedOptions.filter(o => values.includes(o.value)).map(o => o.label);
        }
        const found = normalizedOptions.find(o => o.value === value);
        return found ? found.label : "";
    };

    const labels = getSelectedLabels();

    const filtered = normalizedOptions.filter(o =>
        (o.label || "").toString().toLowerCase().includes((search || "").toLowerCase())
    );

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (val) => {
        let newValue;
        if (isMulti) {
            const currentValues = Array.isArray(value) ? value : [];
            if (currentValues.includes(val)) {
                newValue = currentValues.filter(v => v !== val);
            } else {
                newValue = [...currentValues, val];
            }
        } else {
            newValue = val;
            setOpen(false);
        }

        if (name && typeof onChange === 'function') {
            onChange(name, newValue);
        } else if (typeof onChange === 'function') {
            onChange(newValue);
        }
        setSearch("");
    };

    const removeTag = (e, val) => {
        e.stopPropagation();
        const currentValues = Array.isArray(value) ? value : [];
        const newValue = currentValues.filter(v => v !== val);
        if (name && typeof onChange === 'function') {
            onChange(name, newValue);
        } else if (typeof onChange === 'function') {
            onChange(newValue);
        }
    };

    const isSelected = (val) => {
        if (isMulti) {
            return Array.isArray(value) && value.includes(val);
        }
        return value === val;
    };

    return (
        <div className={`${styles.customDropdown} ${className}`} ref={ref}>
            {label && <label className={styles.label}>{label}</label>}
            <button
                type="button"
                className={`${styles.dropdownTrigger} ${error ? styles.errorInput : ""} ${open ? styles.dropdownOpen : ""} ${isMulti ? styles.multiTrigger : ""}`}
                onClick={() => setOpen(prev => !prev)}
            >
                <div className={styles.triggerContent}>
                    {isMulti && Array.isArray(value) && value.length > 0 ? (
                        <div className={styles.tagsContainer}>
                            {value.map(val => (
                                <span key={val} className={styles.tag}>
                                    {normalizedOptions.find(o => o.value === val)?.label || val}
                                    <X
                                        size={10}
                                        className={styles.removeTag}
                                        onClick={(e) => removeTag(e, val)}
                                    />
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className={value ? styles.selectedValue : styles.placeholder}>
                            {value && !isMulti ? labels : placeholder}
                        </span>
                    )}
                </div>
                <ChevronDown size={16} className={`${styles.chevronIcon} ${open ? styles.rotated : ""}`} />
            </button>

            {open && (
                <div className={styles.dropdownMenu}>
                    <div className={styles.searchWrapper}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className={styles.optionsList}>
                        {!isMulti && (
                            <div
                                className={styles.option}
                                onClick={() => handleSelect("")}
                            >
                                <span className={styles.noneOption}>{placeholder}</span>
                            </div>
                        )}
                        {filtered.length === 0 ? (
                            <div className={styles.noResults}>No results</div>
                        ) : (
                            filtered.map(opt => (
                                <div
                                    key={opt.value}
                                    className={`${styles.option} ${isSelected(opt.value) ? styles.selectedOption : ""}`}
                                    onClick={() => handleSelect(opt.value)}
                                >
                                    {isMulti && (
                                        <input
                                            type="checkbox"
                                            checked={isSelected(opt.value)}
                                            readOnly
                                            className={styles.checkbox}
                                        />
                                    )}
                                    {opt.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default CustomSelect;
