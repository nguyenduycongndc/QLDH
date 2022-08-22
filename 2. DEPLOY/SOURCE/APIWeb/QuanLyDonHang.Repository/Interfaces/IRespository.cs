using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDonHang.Repository.Interfaces
{
    public interface IRepository<T> where T : class
    {
        #region normal function

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

        #region Async Reponsitory

        Task<ICollection<T>> FindAllAsync(Expression<Func<T, bool>> match);
        Task<T> FindAsync(Expression<Func<T, bool>> match);
        Task<T> GetByIdAsync(int id);
        Task<T> GetFirstOrDefaultAsync(Expression<Func<T, bool>> predicate, Func<IQueryable<T>,
        IOrderedQueryable<T>> orderBy = null,
        Func<IQueryable<T>, IIncludableQueryable<T, Object>> include = null);
        Task<IList<T>> GetAllAsync();

        Task<List<T>> GetAllNotWhereAsync();

        Task<T> AddAsync(T entity);
        Task<bool> AddManyAsync(IEnumerable<T> entities);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
        //Task DeleteAsync(T entity);

        #endregion

    }
}
