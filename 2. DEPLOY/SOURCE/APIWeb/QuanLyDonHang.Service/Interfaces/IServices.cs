using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace QuanLyDonHang.Service.Interface
{
    public interface IServices<T> where T: class 
    {
        #region Nomarl function

        T GetById(int id);
        IQueryable<T> GetAll();
        T Find(Expression<Func<T, bool>> match);
        ICollection<T> FindAll(Expression<Func<T, bool>> match);
        T Get(int id);
        IQueryable<T> GetAllIncluding(params Expression<Func<T, object>>[] includeProperties);
        T Add(T entity);
        bool AddMany(IEnumerable<T> entities);
        void Update(T entity);
        void Delete(T entity);

        #endregion

        #region Async function

        Task<ICollection<T>> FindAllAsync(Expression<Func<T, bool>> match);
        Task<T> FindAsync(Expression<Func<T, bool>> match);
        Task<T> GetByIdAsync(int id);
        Task<IList<T>> GetAllAsync();
        Task<T> AddAsync(T entity);
        Task<bool> AddManyAsync(IEnumerable<T> entities);
        Task UpdateAsync(T entity);
        //Task DeleteAsync(T entity);
        Task DeleteAsync(int Id);
        #endregion

        

    }
}
